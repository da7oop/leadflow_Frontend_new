import { RequestHandler } from "express";
import { getEmailProvider } from "../services/emailProvider";
import { z } from "zod";

// Validation schema for email requests
const EmailRequestSchema = z.object({
  to: z
    .string()
    .email("Invalid recipient email address")
    .describe("Primary recipient email"),
  cc: z
    .string()
    .optional()
    .default("")
    .describe("CC recipients (comma-separated)"),
  bcc: z
    .string()
    .optional()
    .default("")
    .describe("BCC recipients (comma-separated)"),
  subject: z.string().min(1, "Subject is required").describe("Email subject"),
  body: z.string().min(1, "Email body is required").describe("Email body"),
});

// Cache for email provider instance
let emailProvider: Awaited<ReturnType<typeof getEmailProvider>> | null = null;

/**
 * Initialize email provider on first use
 * This ensures configuration errors are caught early
 */
const initializeProvider = async () => {
  if (!emailProvider) {
    emailProvider = await getEmailProvider();
    await emailProvider.initialize();
  }
  return emailProvider;
};

/**
 * POST /api/send-email
 *
 * Sends an email using the configured email provider
 *
 * Request body:
 * {
 *   "to": "recipient@example.com",
 *   "cc": "cc@example.com,cc2@example.com",  // optional
 *   "bcc": "bcc@example.com",                 // optional
 *   "subject": "Email subject",
 *   "body": "Email content"
 * }
 *
 * Response (success):
 * {
 *   "success": true,
 *   "message": "Email sent successfully",
 *   "messageId": "...",
 *   "timestamp": "2024-01-15T10:30:00Z"
 * }
 *
 * Response (error):
 * {
 *   "success": false,
 *   "message": "Error description",
 *   "timestamp": "2024-01-15T10:30:00Z"
 * }
 */
export const handleSendEmail: RequestHandler = async (req, res) => {
  try {
    // Validate request body
    const validatedData = EmailRequestSchema.parse(req.body);

    // Initialize email provider
    const provider = await initializeProvider();

    // Send the email
    const result = await provider.send({
      to: validatedData.to,
      cc: validatedData.cc,
      bcc: validatedData.bcc,
      subject: validatedData.subject,
      body: validatedData.body,
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error || "Failed to send email",
        provider: provider.getName(),
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      message: `Email sent successfully to ${validatedData.to}`,
      messageId: result.messageId,
      provider: provider.getName(),
      timestamp: result.timestamp,
    });
  } catch (error) {
    console.error("Email sending error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
        timestamp: new Date().toISOString(),
      });
    }

    // Handle provider initialization errors
    if (error instanceof Error && error.message.includes("not configured")) {
      return res.status(503).json({
        success: false,
        message:
          "Email service is not properly configured. Please contact your system administrator.",
        timestamp: new Date().toISOString(),
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while sending the email",
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * GET /api/email/status
 *
 * Returns the status of the email service configuration
 * Useful for debugging and health checks
 */
export const handleEmailStatus: RequestHandler = async (req, res) => {
  try {
    const provider = await getEmailProvider();

    res.json({
      success: true,
      provider: provider.getName(),
      configured: provider.isConfigured(),
      message: provider.isConfigured()
        ? `Email service ready (${provider.getName()})`
        : `Email service not configured for ${provider.getName()}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to check email service status",
      timestamp: new Date().toISOString(),
    });
  }
};

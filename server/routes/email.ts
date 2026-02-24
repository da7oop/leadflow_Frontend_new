import { RequestHandler } from "express";
import { sendEmail } from "../services/emailService";
import { z } from "zod";

// Validation schema for email requests
const EmailRequestSchema = z.object({
  to: z.string().email("Invalid recipient email address"),
  cc: z.string().optional().default(""),
  bcc: z.string().optional().default(""),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Email body is required"),
});

export const handleSendEmail: RequestHandler = async (req, res) => {
  try {
    // Validate request body
    const validatedData = EmailRequestSchema.parse(req.body);

    // Send the email
    await sendEmail({
      to: validatedData.to,
      cc: validatedData.cc,
      bcc: validatedData.bcc,
      subject: validatedData.subject,
      body: validatedData.body,
    });

    res.json({
      success: true,
      message: `Email sent successfully to ${validatedData.to}`,
      timestamp: new Date().toISOString(),
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
      });
    }

    // Handle email sending errors
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to send email. Please check your Gmail credentials.",
    });
  }
};

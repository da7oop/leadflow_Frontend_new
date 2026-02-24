/**
 * Email Provider Interface
 * 
 * This interface defines the contract for email providers.
 * Backend team can implement different providers (Gmail API, SendGrid, etc.)
 * by implementing this interface.
 */

export interface EmailOptions {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: string;
}

export interface IEmailProvider {
  /**
   * Initialize the email provider with configuration
   * Should validate that all required environment variables are set
   */
  initialize(): Promise<void>;

  /**
   * Send an email using the provider
   */
  send(options: EmailOptions): Promise<EmailResponse>;

  /**
   * Verify that the provider is properly configured
   */
  isConfigured(): boolean;

  /**
   * Get the name of the provider
   */
  getName(): string;
}

/**
 * Email provider factory
 * Automatically selects the appropriate provider based on environment variables
 */
export const getEmailProvider = async (): Promise<IEmailProvider> => {
  const provider = process.env.EMAIL_PROVIDER || "nodemailer";

  switch (provider) {
    case "gmail-api":
      // Placeholder for Gmail API implementation
      const { GmailAPIProvider } = await import(
        "./providers/gmailApiProvider"
      );
      return new GmailAPIProvider();

    case "sendgrid":
      // Placeholder for SendGrid implementation
      const { SendGridProvider } = await import("./providers/sendGridProvider");
      return new SendGridProvider();

    case "nodemailer":
    default:
      // Nodemailer (Gmail App Password) implementation
      const { NodemailerProvider } = await import(
        "./providers/nodemailerProvider"
      );
      return new NodemailerProvider();
  }
};

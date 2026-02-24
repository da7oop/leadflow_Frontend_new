import nodemailer from "nodemailer";
import { IEmailProvider, EmailOptions, EmailResponse } from "../emailProvider";

/**
 * Nodemailer Email Provider
 * 
 * Uses Gmail App Password for authentication
 * Requires: GMAIL_USER, GMAIL_APP_PASSWORD environment variables
 * 
 * Setup instructions:
 * 1. Enable 2-Factor Authentication on Gmail account
 * 2. Generate App Password from https://myaccount.google.com/apppasswords
 * 3. Set GMAIL_USER and GMAIL_APP_PASSWORD environment variables
 */

export class NodemailerProvider implements IEmailProvider {
  private transporter: nodemailer.Transporter | null = null;
  private gmailUser: string;
  private gmailAppPassword: string;

  constructor() {
    this.gmailUser = process.env.GMAIL_USER || "";
    this.gmailAppPassword = process.env.GMAIL_APP_PASSWORD || "";
  }

  async initialize(): Promise<void> {
    if (!this.gmailUser || !this.gmailAppPassword) {
      throw new Error(
        "Nodemailer provider not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables."
      );
    }

    try {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: this.gmailUser,
          pass: this.gmailAppPassword,
        },
      });

      // Verify connection
      await this.transporter.verify();
      console.log("✓ Nodemailer provider initialized successfully");
    } catch (error) {
      throw new Error(
        `Failed to initialize Nodemailer: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  isConfigured(): boolean {
    return !!(this.gmailUser && this.gmailAppPassword);
  }

  getName(): string {
    return "nodemailer";
  }

  async send(options: EmailOptions): Promise<EmailResponse> {
    if (!this.transporter) {
      throw new Error("Email provider not initialized. Call initialize() first.");
    }

    try {
      const ccAddresses = options.cc
        ? options.cc
            .split(",")
            .map((email) => email.trim())
            .filter((email) => email)
        : [];

      const bccAddresses = options.bcc
        ? options.bcc
            .split(",")
            .map((email) => email.trim())
            .filter((email) => email)
        : [];

      const info = await this.transporter.sendMail({
        from: this.gmailUser,
        to: options.to,
        cc: ccAddresses.length > 0 ? ccAddresses.join(", ") : undefined,
        bcc: bccAddresses.length > 0 ? bccAddresses.join(", ") : undefined,
        subject: options.subject,
        html: this.formatEmailBody(options.body),
      });

      console.log(`Email sent: ${info.messageId}`);

      return {
        success: true,
        messageId: info.messageId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to send email:", errorMessage);

      return {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private formatEmailBody(body: string): string {
    const htmlBody = body
      .split("\n")
      .map((line) => {
        if (line.trim().startsWith("•")) {
          return `<li>${line.substring(1).trim()}</li>`;
        }
        return line;
      })
      .join("\n");

    return `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              color: #333;
              line-height: 1.6;
            }
            ul {
              margin: 10px 0;
              padding-left: 20px;
            }
            li {
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <pre style="font-family: inherit; white-space: pre-wrap; word-wrap: break-word;">${htmlBody}</pre>
        </body>
      </html>
    `;
  }
}

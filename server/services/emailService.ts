import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
}

// Create a reusable transporter
const createTransporter = () => {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    throw new Error(
      "Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = createTransporter();

    // Parse CC and BCC (handle comma-separated emails)
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

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: options.to,
      cc: ccAddresses.length > 0 ? ccAddresses.join(", ") : undefined,
      bcc: bccAddresses.length > 0 ? bccAddresses.join(", ") : undefined,
      subject: options.subject,
      html: formatEmailBody(options.body),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(
      `Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

// Format the email body with basic HTML styling
const formatEmailBody = (body: string): string => {
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
};

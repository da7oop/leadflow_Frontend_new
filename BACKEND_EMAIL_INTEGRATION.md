# Backend Email Integration Guide

This document provides instructions for the backend team to integrate email services with the frontend email system.

## Architecture Overview

The email system uses a **pluggable provider pattern** that allows switching between different email services without changing the frontend code.

```
Frontend (Chat UI)
       ↓
POST /api/send-email
       ↓
Email Route Handler (validates & routes)
       ↓
Email Provider Interface (abstraction)
       ↓
┌───────────────────────────────────┐
│ Gmail API  | Nodemailer | SendGrid │
└───────────────────────────────────┘
```

## Current Status

- ✅ **Nodemailer Provider**: Fully implemented (Gmail App Password)
- 🚧 **Gmail API Provider**: Placeholder (needs implementation)
- 🚧 **SendGrid Provider**: Placeholder (needs implementation)

## Files Structure

```
server/
├── services/
│   ├── emailService.ts              # Architecture documentation
│   ├── emailProvider.ts             # Provider interface & factory
│   └── providers/
│       ├── nodemailerProvider.ts    # ✅ Implemented
│       ├── gmailApiProvider.ts      # 🚧 Placeholder
│       └── sendGridProvider.ts      # 🚧 Placeholder
├── routes/
│   └── email.ts                     # API endpoints
└── index.ts                         # Server setup
```

## API Endpoints

### POST `/api/send-email`

Sends an email using the configured provider.

**Request:**
```json
{
  "to": "recipient@example.com",
  "cc": "cc1@example.com,cc2@example.com",
  "bcc": "bcc@example.com",
  "subject": "Email subject",
  "body": "Email content"
}
```

**Response (Success 200):**
```json
{
  "success": true,
  "message": "Email sent successfully to recipient@example.com",
  "messageId": "abc123def456",
  "provider": "nodemailer",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Response (Error 500):**
```json
{
  "success": false,
  "message": "Authentication failed",
  "provider": "gmail-api",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET `/api/email/status`

Returns the status of the email service.

**Response:**
```json
{
  "success": true,
  "provider": "nodemailer",
  "configured": true,
  "message": "Email service ready (nodemailer)",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Implementing a New Provider

### 1. Create Provider Class

Create a new file in `server/services/providers/`:

```typescript
import { IEmailProvider, EmailOptions, EmailResponse } from "../emailProvider";

export class MyEmailProvider implements IEmailProvider {
  async initialize(): Promise<void> {
    // Setup: validate credentials, initialize client
  }

  isConfigured(): boolean {
    // Check if all required env vars are set
    return !!process.env.MY_EMAIL_API_KEY;
  }

  getName(): string {
    return "my-provider";
  }

  async send(options: EmailOptions): Promise<EmailResponse> {
    // Send email using your service
    // Parse CC/BCC (comma-separated strings)
    // Return success or error response
  }
}
```

### 2. Register Provider in Factory

Update `server/services/emailProvider.ts`:

```typescript
case "my-provider":
  const { MyEmailProvider } = await import("./providers/myProvider");
  return new MyEmailProvider();
```

### 3. Set Environment Variable

In `.env` or deployment secrets:

```env
EMAIL_PROVIDER=my-provider
MY_EMAIL_API_KEY=your_api_key_here
```

### 4. No Hardcoded Credentials

✅ **DO:**
```typescript
const apiKey = process.env.MY_EMAIL_API_KEY;
```

❌ **DON'T:**
```typescript
const apiKey = "sk-1234567890abcdef"; // NEVER hardcode!
```

## Implementation Examples

### Gmail API Provider

**Files to implement:**
- `server/services/providers/gmailApiProvider.ts`

**Requirements:**
- `pnpm add googleapis google-auth-library`
- Service account setup (see `gmailApiProvider.ts` comments)
- Environment variables: `GMAIL_SERVICE_ACCOUNT_EMAIL`, `GMAIL_SERVICE_ACCOUNT_KEY`

**Key methods:**
```typescript
async initialize(): Promise<void> {
  // 1. Load service account credentials
  // 2. Create JWT client
  // 3. Verify permissions
}

async send(options: EmailOptions): Promise<EmailResponse> {
  // 1. Build RFC 2822 formatted message
  // 2. Encode in base64
  // 3. Call Gmail API: users.messages.send()
  // 4. Return response with messageId
}
```

### SendGrid Provider

**Files to implement:**
- `server/services/providers/sendGridProvider.ts`

**Requirements:**
- `pnpm add @sendgrid/mail`
- SendGrid account and API key
- Environment variables: `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`

**Key methods:**
```typescript
async initialize(): Promise<void> {
  // 1. Load API key
  // 2. Initialize SendGrid client
  // 3. Verify credentials
}

async send(options: EmailOptions): Promise<EmailResponse> {
  // 1. Build message object
  // 2. Parse CC/BCC recipients
  // 3. Call sgMail.send()
  // 4. Return response with messageId
}
```

## Environment Variables

### Nodemailer (Default)

```env
EMAIL_PROVIDER=nodemailer
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

### Gmail API

```env
EMAIL_PROVIDER=gmail-api
GMAIL_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GMAIL_SERVICE_ACCOUNT_KEY=/path/to/service-account-key.json
# OR
GMAIL_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### SendGrid

```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@example.com
```

## Testing

### Local Testing with Nodemailer

1. Enable 2FA on Gmail
2. Generate app password
3. Set environment variables
4. Run server: `pnpm dev`
5. Trigger email from chat interface

### Testing New Provider

1. Implement the provider class
2. Add to factory switch statement
3. Set `EMAIL_PROVIDER=your-provider`
4. Set required credentials
5. Call `GET /api/email/status` to verify setup
6. Send test email via `POST /api/send-email`

### Error Debugging

Check server logs for initialization errors:

```
✓ Nodemailer provider initialized successfully
⚠ Gmail API provider is not yet implemented by backend team
```

If provider fails to initialize, check:
- ✓ EMAIL_PROVIDER is set correctly
- ✓ All required environment variables are present
- ✓ Credentials are valid
- ✓ API keys haven't expired or been revoked

## Security Best Practices

### 1. Never Hardcode Credentials

```typescript
// ❌ BAD
const apiKey = "sk-1234567890";

// ✅ GOOD
const apiKey = process.env.MY_EMAIL_API_KEY;
if (!apiKey) throw new Error("API key not configured");
```

### 2. Validate All Inputs

```typescript
// ✅ Frontend validates, but backend must validate too
if (!isValidEmail(options.to)) {
  return { success: false, error: "Invalid email address" };
}
```

### 3. Use Secrets Management

- **Development**: `.env` file (local only)
- **Staging**: Environment variables via CI/CD secrets
- **Production**: Secrets manager (AWS Secrets Manager, Vault, etc.)

### 4. Log Securely

```typescript
// ✅ Log message ID, not credentials
console.log(`Email sent: ${info.messageId}`);

// ❌ Never log credentials
console.log(`API Key: ${apiKey}`);
```

### 5. Error Messages

```typescript
// ✅ Generic error message to user
return { success: false, error: "Failed to send email" };

// Log detailed error server-side for debugging
console.error("Gmail API error:", detailedError);
```

## Migration Path

To migrate from one provider to another:

1. **Prepare new provider** (implement and test)
2. **Verify backward compatibility** (both providers work)
3. **Set new provider as default** (`EMAIL_PROVIDER=new-provider`)
4. **Monitor for issues** (check logs, delivery status)
5. **Deprecate old provider** (once stable)

Example migration sequence:
1. Start with Nodemailer (no backend work needed)
2. Implement Gmail API provider
3. Test both providers in staging
4. Switch production to Gmail API
5. Keep Nodemailer as fallback

## Troubleshooting

### Provider not initialized

```
Error: Email provider not configured
```

**Solution:**
- Check environment variables are set
- Verify credentials are correct
- Restart server after changing `.env`

### Authentication failed

```
Error: Authentication failed
```

**Solution:**
- Verify credentials haven't expired
- Check API keys/passwords are correct
- Ensure service has required permissions

### Rate limiting

```
Error: Rate limit exceeded
```

**Solution:**
- Implement exponential backoff retry logic
- Add rate limiting to frontend
- Use batch sending for multiple emails

## Support & Documentation

- **Frontend**: See `client/components/EmailEditor.tsx`
- **Email Routes**: See `server/routes/email.ts`
- **Architecture**: See `server/services/emailService.ts`
- **Provider Placeholders**: See `server/services/providers/`

## Questions?

For implementation questions, refer to:
1. Provider placeholder files (detailed comments)
2. Interface definition in `emailProvider.ts`
3. Existing Nodemailer implementation as reference
4. Official service documentation (Gmail API, SendGrid, etc.)

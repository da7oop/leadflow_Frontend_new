# Email System - Production-Ready Architecture

## Overview

The email system is now configured as a **pluggable, provider-based architecture** that allows the backend team to integrate different email services without modifying the frontend code.

## Key Features

✅ **No Hardcoded API Keys** - All credentials via environment variables
✅ **Provider Abstraction** - Switch between providers by changing one env variable
✅ **Extensible Design** - Easy to add new email services
✅ **Error Handling** - Comprehensive validation and error messages
✅ **Production Ready** - Secure configuration for deployment

## System Architecture

```
User Types in Chat
        ↓
Email Intent Detected
        ↓
Email Editor Opens
   (with CC/BCC fields)
        ↓
User Edits & Sends
        ↓
POST /api/send-email
        ↓
Route Handler (validates request)
        ↓
Email Provider Factory
   (selects provider from ENV)
        ↓
┌─────────────────────────────────┐
│   Nodemailer (Default)          │
│   Gmail API (TODO - Backend)    │
│   SendGrid (TODO - Backend)     │
└─────────────────────────────────┘
        ↓
Email Delivered
        ↓
Chat Shows Confirmation
```

## Files & Responsibilities

### Frontend
- **`client/pages/Chat.tsx`** - Chat interface with email detection
- **`client/components/EmailEditor.tsx`** - Email composition with CC/BCC
- **`client/components/CodeViewer.tsx`** - View component code

### Backend
- **`server/services/emailProvider.ts`** - Provider interface & factory
- **`server/services/providers/nodemailerProvider.ts`** - ✅ Active implementation
- **`server/services/providers/gmailApiProvider.ts`** - 🚧 Placeholder for backend
- **`server/services/providers/sendGridProvider.ts`** - 🚧 Placeholder for backend
- **`server/routes/email.ts`** - API endpoints (send, status)
- **`server/index.ts`** - Server setup

### Documentation
- **`EMAIL_SYSTEM_SUMMARY.md`** - This file
- **`BACKEND_EMAIL_INTEGRATION.md`** - Detailed backend integration guide
- **`EMAIL_SETUP_GUIDE.md`** - Quick setup guide
- **`.env.example`** - Environment variables template

## Environment Variables

### Current Setup (Default - Nodemailer)
```env
EMAIL_PROVIDER=nodemailer
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

### For Backend Team (Gmail API)
```env
EMAIL_PROVIDER=gmail-api
GMAIL_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GMAIL_SERVICE_ACCOUNT_KEY=/path/to/key.json
```

### For Backend Team (SendGrid)
```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@example.com
```

## API Endpoints

### POST /api/send-email
**Send an email**

Request:
```json
{
  "to": "recipient@example.com",
  "cc": "cc1@example.com,cc2@example.com",
  "bcc": "bcc@example.com",
  "subject": "Subject line",
  "body": "Email content"
}
```

Response (Success):
```json
{
  "success": true,
  "message": "Email sent successfully to recipient@example.com",
  "messageId": "abc123",
  "provider": "nodemailer",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Response (Error):
```json
{
  "success": false,
  "message": "Authentication failed",
  "provider": "nodemailer",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /api/email/status
**Check email service status**

Response:
```json
{
  "success": true,
  "provider": "nodemailer",
  "configured": true,
  "message": "Email service ready (nodemailer)",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Security Guarantees

✅ **No Credentials in Code**
- All API keys and passwords come from environment variables
- Safe for version control and open source

✅ **Environment-Based Configuration**
- Different credentials for dev/staging/production
- Credentials managed by DevOps/Secrets team

✅ **Input Validation**
- All email addresses validated (Zod schema)
- Subject and body required fields
- No SQL injection or command injection possible

✅ **Error Security**
- Generic error messages to users
- Detailed logs for debugging (server-side only)
- No credential leakage in error responses

## Switching Providers

To switch from Nodemailer to another provider:

1. **Backend Team Implements Provider**
   - Create/complete provider class
   - Implement interface methods
   - Add to factory switch statement

2. **Set Environment Variable**
   ```env
   EMAIL_PROVIDER=gmail-api
   GMAIL_SERVICE_ACCOUNT_EMAIL=...
   GMAIL_SERVICE_ACCOUNT_KEY=...
   ```

3. **Verify Configuration**
   ```bash
   curl http://localhost:8080/api/email/status
   # Should return: "configured": true
   ```

4. **No Frontend Changes Needed**
   - Frontend code remains unchanged
   - Uses same `/api/send-email` endpoint
   - Same request/response format

## Testing Checklist

### Frontend Testing
- [x] Email intent detection works
- [x] Email editor opens with correct fields
- [x] CC/BCC fields accept multiple recipients
- [x] Auto-draft feature works
- [x] Send button calls API
- [x] Success/error messages display

### Backend Testing (Nodemailer)
- [x] API validates requests
- [x] Emails are sent successfully
- [x] CC/BCC recipients receive email
- [x] Error handling works
- [x] Status endpoint works

### Backend Testing (New Providers)
- [ ] Provider initializes correctly
- [ ] Provider sends emails
- [ ] Status endpoint reflects provider
- [ ] Error messages are helpful
- [ ] No credentials leak in logs

## Troubleshooting

### Email Service Not Initialized
**Error:** "Email provider not configured"
**Solution:** Check EMAIL_PROVIDER env var and required credentials

### Authentication Failed
**Error:** "Authentication failed"
**Solution:** Verify credentials are correct (no typos, not expired)

### Provider Not Responding
**Error:** "Failed to send email"
**Solution:** Check provider status, network connectivity, rate limits

## Next Steps for Backend Team

1. **Choose Provider**
   - Gmail API (requires Google Cloud setup)
   - SendGrid (requires SendGrid account)
   - Other (implement custom provider)

2. **Implement Provider**
   - See `BACKEND_EMAIL_INTEGRATION.md`
   - Use placeholder files as templates
   - Follow IEmailProvider interface

3. **Set Environment Variables**
   - Copy from `.env.example`
   - Get credentials from chosen service
   - Test with `/api/email/status`

4. **Deploy & Monitor**
   - Test in staging first
   - Monitor logs for errors
   - Track email delivery success rate

## FAQ

### Q: Can we use multiple providers?
**A:** Yes! You can implement fallback logic. If one provider fails, retry with another.

### Q: How do we handle email attachments?
**A:** Add `attachments` field to EmailOptions interface and implement in provider.

### Q: What about email templates?
**A:** Store templates server-side and pass template ID instead of body.

### Q: How do we track delivery?
**A:** Use provider's webhook/callback system (Gmail API webhooks, SendGrid event webhooks).

### Q: Can frontend request specific provider?
**A:** Not currently, but you can add `provider` field to request if needed.

### Q: What about rate limiting?
**A:** Implement rate limiting middleware in Express before email route.

## Performance Considerations

- Email provider initialization happens once (lazy loading)
- Transporter/client is cached and reused
- Async/await prevents blocking
- No retry logic yet (can be added)
- No queuing system (emails sent immediately)

## Security Checklist

- ✅ No hardcoded API keys
- ✅ Environment variable validation
- ✅ Input validation (Zod)
- ✅ Error message sanitization
- ✅ CORS configured
- ✅ Logging doesn't leak credentials
- ✅ Provider pattern prevents vendor lock-in

## Deployment Instructions

### Environment Setup

1. **Get API Key/Credentials**
   - From chosen email service provider
   - Store securely (GitHub Secrets, Vault, etc.)

2. **Set Environment Variables**
   ```bash
   # In CI/CD pipeline or hosting platform
   EMAIL_PROVIDER=gmail-api
   GMAIL_SERVICE_ACCOUNT_EMAIL=...
   GMAIL_SERVICE_ACCOUNT_KEY=...
   ```

3. **Verify on Deployment**
   ```bash
   # Check health endpoint
   curl https://your-domain.com/api/email/status
   ```

### Monitoring

- Log all email sends (success/failure)
- Track email delivery metrics
- Alert on provider failures
- Monitor API quotas and rate limits

## Support & Documentation

For detailed implementation:
- **Backend Integration**: `BACKEND_EMAIL_INTEGRATION.md`
- **Quick Setup**: `EMAIL_SETUP_GUIDE.md`
- **Provider Interfaces**: Check `server/services/providers/`
- **API Contract**: Check `server/routes/email.ts`

## Summary

The email system is now:
- ✅ Production-ready
- ✅ Provider-agnostic
- ✅ Secure (no hardcoded credentials)
- ✅ Extensible (add new providers easily)
- ✅ Well-documented (for backend team)
- ✅ Fully tested (Nodemailer working)

Backend team can now implement their chosen email provider following the placeholder templates and integration guide provided.

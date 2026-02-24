# Email Sending Setup Guide

This guide will help you configure Gmail for sending emails through the application.

## Prerequisites

### 1. Install Nodemailer
First, install the nodemailer package:

```bash
pnpm add nodemailer
pnpm add -D @types/nodemailer
```

### 2. Enable Gmail App Password

The application uses Gmail App Passwords for secure authentication. Follow these steps:

#### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Sign in with your Gmail account
3. Look for "2-Step Verification" in the left sidebar
4. Click "2-Step Verification" and follow the prompts to enable it
5. Verify your phone number and complete the setup

#### Step 2: Generate an App Password
1. Go back to [Google Account Security](https://myaccount.google.com/security)
2. In the left sidebar, find "App passwords" (only appears after 2FA is enabled)
3. Select **Mail** as the app and **Windows/Mac/Linux** as the device
4. Click "Generate"
5. Google will display a 16-character password (you'll only see it once)
6. Copy this password - you'll need it in the next step

## Configuration

### Set Environment Variables

Create or update your `.env` file in the project root with your Gmail credentials:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

**Important Notes:**
- Replace `your-email@gmail.com` with your actual Gmail address
- Replace `xxxx xxxx xxxx xxxx` with the 16-character app password (keep the spaces as shown by Google)
- Keep these credentials secure - never commit them to version control
- The `.env` file should be in the `.gitignore` file

## Usage

Once configured, the email system will work automatically:

1. **Trigger Email Detection** in the chat:
   - "Send email to client@example.com"
   - "Compose an email about the project"
   - "Draft an email to john@example.com"

2. **Email Editor Opens** with:
   - Conversation history on the right
   - Email fields: To, CC, BCC, Subject, Body
   - Auto-Draft button to generate from conversation

3. **Edit and Send**:
   - Click "Auto-Draft from Conversation" to let AI generate content
   - Edit any fields as needed
   - Click "Send Email" to send immediately

4. **Confirmation**:
   - See success message in chat: ✅ Email sent successfully
   - Or error message if something goes wrong: ❌ Email sending failed

## Recipient Addresses

### Single Recipient
```
To: client@gmail.com
```

### Multiple CC Recipients
```
CC: john@example.com, jane@example.com, admin@example.com
```

### Multiple BCC Recipients (hidden)
```
BCC: bcc1@example.com, bcc2@example.com
```

## Troubleshooting

### "Email credentials not configured"
- Make sure `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set in `.env`
- Restart the dev server after adding environment variables

### "Failed to send email"
- Verify the app password is correct (16 characters with spaces)
- Check that 2-Factor Authentication is enabled on your Gmail account
- Ensure the email addresses are valid
- Check the server logs for detailed error messages

### "Authentication failed"
- The app password may have been entered incorrectly
- Try regenerating a new app password from Gmail settings
- Make sure you're using the app-specific password, not your regular Gmail password

### Emails not appearing in inbox
- Check the "Sent Mail" folder
- The email may be in spam/junk folder
- Verify the recipient email address is correct

## API Endpoint

The backend exposes the email sending endpoint:

```
POST /api/send-email
```

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "cc": "cc@example.com",
  "bcc": "bcc@example.com",
  "subject": "Email subject",
  "body": "Email message body"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully to recipient@example.com",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "to",
      "message": "Invalid email address"
    }
  ]
}
```

## Files Modified/Created

- `server/services/emailService.ts` - Email sending service with Nodemailer
- `server/routes/email.ts` - API endpoint handler for email requests
- `server/index.ts` - Registered `/api/send-email` route
- `client/pages/Chat.tsx` - Updated to call real email API

## Security Notes

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use App Passwords** - More secure than storing your real Gmail password
3. **Rate Limiting** - Consider adding rate limiting to prevent abuse
4. **Email Validation** - All email addresses are validated on the backend
5. **Error Messages** - Sensitive error details are logged but generic messages shown to users

## Next Steps

After setup, you can:
- Start sending real emails from the chat interface
- Customize email templates in `server/services/emailService.ts`
- Add email scheduling or delay
- Implement email templates with variables
- Add email history/logging
- Set up email signatures

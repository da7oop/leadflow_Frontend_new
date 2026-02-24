/**
 * Email Service Module
 * 
 * This module provides a pluggable architecture for email sending.
 * Different email providers can be used based on the EMAIL_PROVIDER environment variable.
 * 
 * ARCHITECTURE:
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    Client (Chat Component)                    │
 * │                   POST /api/send-email                        │
 * └────────────────────────┬────────────────────────────────────┘
 *                          │
 *                          ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │              Email API Route (routes/email.ts)               │
 * │  - Validates request (Zod schema)                            │
 * │  - Initializes email provider                                │
 * │  - Calls provider.send()                                     │
 * │  - Returns response                                          │
 * └────────────────────────┬────────────────────────────────────┘
 *                          │
 *                          ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │         Email Provider Interface (emailProvider.ts)          │
 * │                                                               │
 * │  Abstraction layer for different email services              │
 * │  - initialize()      - Setup and validate config             │
 * │  - send()            - Send email                            │
 * │  - isConfigured()    - Check if provider is ready            │
 * │  - getName()         - Get provider name                     │
 * └────────────────────────┬────────────────────────────────────┘
 *                          │
 *         ┌────────────────┼────────────────┐
 *         ▼                ▼                ▼
 *  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
 *  │ Nodemailer   │ │  Gmail API   │ │  SendGrid    │
 *  │  Provider    │ │  Provider    │ │  Provider    │
 *  │              │ │              │ │              │
 *  │ Status: ✓    │ │ Status: TODO │ │ Status: TODO │
 *  │ Impl: Done   │ │ Impl: Impl   │ │ Impl: Impl   │
 *  └──────────────┘ └──────────────┘ └──────────────┘
 * 
 * 
 * ENVIRONMENT VARIABLES:
 * 
 * EMAIL_PROVIDER (optional)
 *   - "nodemailer" (default) - Gmail App Password
 *   - "gmail-api"           - Gmail API with service account
 *   - "sendgrid"            - SendGrid service
 * 
 * For Nodemailer (Gmail App Password):
 *   GMAIL_USER              - Gmail address (e.g., user@gmail.com)
 *   GMAIL_APP_PASSWORD      - 16-char app password from Gmail settings
 * 
 * For Gmail API:
 *   GMAIL_SERVICE_ACCOUNT_EMAIL  - Service account email
 *   GMAIL_SERVICE_ACCOUNT_KEY    - Path or JSON of service account key
 * 
 * For SendGrid:
 *   SENDGRID_API_KEY        - SendGrid API key
 *   SENDGRID_FROM_EMAIL     - Sender email address
 * 
 * 
 * USAGE:
 * 
 * 1. Set desired EMAIL_PROVIDER in .env
 * 2. Configure required credentials for that provider
 * 3. The system will automatically initialize the provider on first request
 * 4. All emails are sent through the selected provider
 * 
 * 
 * SWITCHING PROVIDERS:
 * 
 * To switch from one provider to another:
 * 1. Change EMAIL_PROVIDER environment variable
 * 2. Update credentials for new provider
 * 3. Restart the server
 * 4. First email request will initialize the new provider
 * 
 * 
 * NO HARDCODED CREDENTIALS:
 * 
 * ✓ All API keys and passwords come from environment variables
 * ✓ No credentials are stored in code
 * ✓ All credentials must be set via .env or deployment secrets
 * ✓ Safe for version control and open source
 * 
 */

// This file is for documentation only.
// Import from emailProvider.ts to access the provider interface
export * from "./emailProvider";

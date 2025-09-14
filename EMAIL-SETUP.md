# Email Integration Setup Guide

This document explains how to set up email functionality for the contact form in the Suduli Resume Automotive website.

## Overview

The contact form now sends real emails to `suduli.office@gmail.com` using Gmail SMTP via nodemailer. When a visitor submits the contact form, an email is sent containing their message details.

## Environment Variables Required

To enable email functionality, you need to set up the following environment variables in your Vercel deployment:

### 1. Gmail Configuration
- `GMAIL_USER`: Your Gmail address (e.g., "suduli.office@gmail.com")
- `GMAIL_APP_PASSWORD`: Gmail App Password (see setup instructions below)

### 2. Setting up Gmail App Password

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Select "Security" → "2-Step Verification" → "App passwords"
   - Generate a new app password for "Mail"
   - Use this 16-character password as `GMAIL_APP_PASSWORD`

### 3. Adding Environment Variables to Vercel

```bash
# Via Vercel CLI
vercel env add GMAIL_USER
vercel env add GMAIL_APP_PASSWORD

# Or via Vercel Dashboard
# Go to Project Settings → Environment Variables
```

## API Endpoint

### `/api/send-email`

**Method:** POST  
**Content-Type:** application/json

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "message": "Hello, I'm interested in your services..."
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Email sent successfully! I will get back to you soon.",
  "timestamp": 1699123456789
}
```

**Error Response:**
```json
{
  "error": "Error type",
  "message": "Descriptive error message"
}
```

## Features

### Security & Rate Limiting
- ✅ Rate limiting: Max 3 emails per minute per IP address
- ✅ Input sanitization and validation
- ✅ Email format validation
- ✅ CORS protection
- ✅ Error handling without exposing internal details

### Email Features
- ✅ Professional HTML email template
- ✅ Automatic reply-to field set to sender's email
- ✅ Message sanitization and formatting
- ✅ Timestamp and contact details included
- ✅ Mobile-friendly email design

### User Experience
- ✅ Loading states with spinner animation
- ✅ Form validation with user-friendly error messages
- ✅ Success notifications
- ✅ Form reset after successful submission
- ✅ Accessibility improvements

## Testing

### Local Testing
```bash
# Install dependencies
npm install

# Test basic API structure
node -e "require('./api/send-email.js'); console.log('API loads successfully');"
```

### Production Testing
1. Deploy to Vercel with environment variables set
2. Submit test message through contact form
3. Check `suduli.office@gmail.com` for received email

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Verify `GMAIL_APP_PASSWORD` is correct 16-character app password
   - Ensure 2FA is enabled on Gmail account

2. **"Rate limit exceeded"**
   - Wait 1 minute between test submissions
   - Rate limit is 3 emails per minute per IP

3. **"Network error"**
   - Check Vercel function logs
   - Verify environment variables are set correctly

4. **Email not received**
   - Check spam/junk folder
   - Verify `GMAIL_USER` environment variable
   - Check Vercel function logs for errors

### Debug Mode
The API includes console logging for debugging:
- Request IP addresses and rate limiting
- Email sending attempts and success/failure
- Error details (in server logs only)

## Security Considerations

- App passwords are more secure than using your main Gmail password
- Rate limiting prevents abuse
- Input sanitization prevents injection attacks
- Error messages don't expose sensitive system information
- CORS headers properly configured

## Email Template

The sent emails include:
- Professional styling with gradient header
- Contact details (name, email, timestamp)
- Original message with preserved formatting
- Reply-to field for easy responses
- Mobile-responsive design
- Both HTML and plain text versions

## Cost Considerations

- Gmail SMTP is free for reasonable usage volumes
- Vercel functions have generous free tier limits
- Rate limiting helps prevent unexpected costs from abuse
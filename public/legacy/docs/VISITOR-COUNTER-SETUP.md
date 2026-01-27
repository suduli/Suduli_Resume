# Visitor Counter Setup Guide

## Local Development

The visitor counter works best with the Vercel development environment to test the API functionality.

### Quick Start (Demo Mode)

When running the site with a simple HTTP server (like `http-server`), the visitor counter will automatically switch to **Demo Mode**, which shows simulated visitor counts without requiring the API to be working.

```bash
# Start with http-server (demo mode automatically enabled)
npm run preview
# or
npx http-server
```

### Testing with Real API

To test the full functionality including the API:

1. Install Vercel CLI if not already installed:

```bash
npm install -g vercel
```

2. Run the development server:

```bash
npm run dev
# or
vercel dev
```

This will start a local development server that can execute the serverless functions.

## Environment Variables

For the visitor counter to work with a real database, you need to set up the following environment variables:

### For Firebase Firestore:

```
DATABASE_TYPE=firestore
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### For Supabase:

```
DATABASE_TYPE=supabase
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
```

You can set these in your Vercel project settings or in a `.env.local` file for local development.

## Common Issues

### 404 Not Found for API Endpoint

If you see 404 errors when accessing `/api/visitors`:

- If using `http-server`: This is expected because it can't execute serverless functions. The counter will fall back to demo mode.
- If using `vercel dev`: Check that you've set up environment variables correctly.

### Default Values Showing

If the counter shows default values (even with animations):

1. Check browser console for API errors
2. Verify environment variables are set correctly
3. Try refreshing or clearing localStorage: `localStorage.clear()`

## Deployment

When deploying to Vercel, make sure to set up the environment variables in your Vercel project settings.

```bash
vercel --prod
```

## Testing

To test the visitor counter without affecting your main database:

```bash
# Use the test page
open tests/test-visitor-counter.html
```

The test page has demo mode enabled by default and shows random counter values.

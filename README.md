This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Authentication

This project uses **NextAuth.js v4** with multiple authentication methods:

### Available Methods

1. **Credentials (Email + Password)**
   - Users can sign up and sign in with email and password
   - Passwords are hashed with bcrypt (12 rounds)
   - User data stored in Upstash Redis

2. **Google OAuth** (optional)
   - Requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
   - Configure in [Google Cloud Console](https://console.cloud.google.com/)

### Required Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# Required for NextAuth
NEXTAUTH_SECRET=your-secret-here  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Required for user storage
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (dev) and your production URL
6. Copy Client ID and Client Secret to `.env.local`

### User Registration Endpoint

- **POST** `/api/auth/register`
- Validates username, email, password
- Hashes password with bcrypt
- Stores user in Redis: `user:{email}`
- Returns user object without password hash

### Security Features

- Passwords hashed with bcrypt (12 rounds)
- Never returns `passwordHash` in responses
- Email validation
- Username validation (3-30 chars, alphanumeric, dash, underscore)
- Password minimum 8 characters
- Terms & Conditions checkbox required on signup

### Session Management

- Strategy: JWT
- Session stored in HTTP-only cookie
- Automatic session refresh
- Compatible with `callbackUrl` redirects

Note: Upstash on Vercel often provides `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
You can duplicate those values into `UPSTASH_REDIS_URL` / `UPSTASH_REDIS_TOKEN`.

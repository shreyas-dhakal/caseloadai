# Caseload AI Showcase

This is a standalone marketing/demo site for Caseload AI. It has no imports, API calls, or runtime dependency on the main product in `agents/`.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`. Do not open `index.html` directly from Finder, because Vite is required to resolve the React module imports.

## Deploy to Vercel

In Vercel, import the repository and set the project root directory to `showcase-site`. The included `vercel.json` sets the Vite build and output directory explicitly.

## Configure demo emails

The form sends requests through the Vercel serverless function in `api/send-demo.js` and Resend. Add these environment variables in Vercel (and in a local `.env` file when testing locally):

- `RESEND_API_KEY`: your Resend API key. Keep this server-side; do not prefix it with `VITE_`.
- `RESEND_FROM_EMAIL`: a sender address on a domain verified in Resend, such as `website@your-domain.com`.
- `RESEND_TO_EMAIL`: the inbox where demo requests should arrive.

Copy `.env.example` as a starting point. The visitor's email is set as `Reply-To`, so replying to the notification goes directly to them. After adding the variables, redeploy Vercel for them to take effect.

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

The form sends requests through the Vercel serverless function in `api/send-demo.js` and FormSubmit. Add this environment variable in Vercel (and in a local `.env` file when testing locally):

- `FORMSUBMIT_TO_EMAIL`: the inbox where demo requests should arrive.

Copy `.env.example` as a starting point. The visitor's email is set as `Reply-To`, so replying to the notification goes directly to them. After adding the variables, redeploy Vercel for them to take effect.

FormSubmit sends a confirmation email to the recipient after the first request. Click the confirmation link once; later requests will be delivered automatically. No domain or API key is required.

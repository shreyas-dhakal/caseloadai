# Caseload AI Showcase

This is a standalone marketing/demo site for Caseload AI. It has no imports, API calls, or runtime dependency on the main product in `agents/`.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`. Do not open `index.html` directly from Finder, because Vite is required to resolve the React module imports.

## Deploy to Vercel

In Vercel, import the repository and set the project root directory to `showcase-site`. The included `vercel.json` sets the Vite build and output directory explicitly. The demo request form is intentionally front-end only for this showcase; connect the submit handler to an email or CRM provider when ready.

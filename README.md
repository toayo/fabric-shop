# Harvey's — Premium Fabrics in Jamaica

A production-ready, animated fabric storefront built with Next.js App Router, Tailwind CSS, Framer Motion, and Stripe. Designed for Netlify deployment with serverless Stripe payment intent creation.

## How to run locally

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## How to deploy to Netlify

1. Push this repo to GitHub.
2. In Netlify, create a new site from the repo.
3. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
4. Add the required environment variables (see below).

Netlify uses `netlify.toml` with `@netlify/plugin-nextjs` for Next.js support.

## Stripe + Apple Pay configuration

1. **Create a Stripe account** and get your API keys.
2. **Enable Apple Pay:**
   - In Stripe Dashboard, go to *Settings → Payment methods* and ensure Apple Pay is enabled.
   - Add your Netlify domain in *Settings → Payment methods → Apple Pay* and complete domain verification.
3. **Set Netlify environment variables:**
   - `STRIPE_SECRET_KEY` (server-side secret)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (client-side publishable key)
   - Optional: `NEXT_PUBLIC_STRIPE_CURRENCY` (defaults to `jmd`)
4. **HTTPS requirement:** Apple Pay is only available on HTTPS with verified domains.

## Project structure

- `app/` — Next.js App Router pages and components
- `data/products.ts` — seed catalog data
- `lib/` — utilities, cart store, formatting helpers
- `netlify/functions/` — Stripe payment intent creation
- `public/` — static assets (no bundled imagery)

## Notes

- Currency display defaults to JMD (Jamaican Dollars). Stripe supports multiple currencies — adjust `NEXT_PUBLIC_STRIPE_CURRENCY` if needed.
- Cart is stored in `localStorage` for persistence.

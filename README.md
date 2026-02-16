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

## Admin dashboard usage

1. Set the `ADMIN_PASSWORD` environment variable.
2. Visit `/admin/login` and enter the password.
3. Manage products and shipping rates from `/admin` when database features are enabled.

## Product images (Cloudinary)

This project uses Cloudinary URLs so the repo stays image-free.

1. Create a Cloudinary account and upload preset.
2. Set the following env vars:
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
3. Ensure the preset allows unsigned uploads from your Netlify domain.
4. In the admin product form, click **Upload images** to add image URLs.
5. Keep logo usage external as well (e.g., the header logo uses a Cloudinary URL) and do not commit `public/*.png` logo binaries.
6. Before opening PRs, verify no tracked binary assets with `git ls-files | rg -n '\.(png|jpg|jpeg|webp|gif|ico|pdf)$'`.

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

## Order emails

Order confirmation emails are not configured in this static build.

## Deploy checklist (Netlify env vars)

## Required Netlify environment variables

Required for a fully functional production deployment:

- `ADMIN_PASSWORD`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`

Optional (feature-specific):

- `NEXT_PUBLIC_STRIPE_CURRENCY` (default: `jmd`)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `GMAIL_ONLY` (set to `true` to require Gmail addresses)

## Notes

- Currency display defaults to JMD (Jamaican Dollars). Stripe supports multiple currencies — adjust `NEXT_PUBLIC_STRIPE_CURRENCY` if needed.
- Cart is stored in `localStorage` for persistence.

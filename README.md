# StayDrippy E-Commerce Platform

A full-stack e-commerce web application built with Next.js (App Router) and Strapi, featuring Stripe payments, Cloudinary media storage, and scalable architecture.

## Features

- Modern Next.js frontend with SSR, static generation, and optimized routing
- Strapi backend for headless CMS and REST API
- PostgreSQL database with relational schema
- Stripe payment integration
- Cloudinary for fast, optimized media uploads
- Zustand for global state management (cart, wishlist)
- Filtering, sorting, and pagination for products
- Secure authentication and protected routes
- Responsive UI with Tailwind CSS
- Deployed on Vercel for scalability

## Tech Stack

- **Frontend:** Next.js 13+, React, Zustand, Tailwind CSS
- **Backend:** Strapi, Node.js, PostgreSQL
- **Payments:** Stripe
- **Media:** Cloudinary
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database
- Cloudinary account
- Stripe account

### Backend Setup (Strapi)

1. Clone the repo and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Configure environment variables in `.env` (see `.env.example`).
3. Start Strapi:
   ```bash
   npm run develop
   ```
4. Access the admin panel at `http://localhost:1337/admin`.

### Frontend Setup (Next.js)

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Create a `.env.local` file and set:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:1337
   NEXT_PUBLIC_CLOUDINARY_URL=...
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=...
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000`.

## Deployment

- **Frontend:** Deploy to [Vercel](https://vercel.com/) (auto-detects Next.js).
- **Backend:** Deploy Strapi to your preferred cloud provider (Render, Heroku, etc.).
- Set environment variables and secrets in Vercel’s dashboard.

## Environment Variables

- API URLs, Stripe keys, and Cloudinary credentials are managed via `.env.local` (local) and Vercel dashboard (production).
- Never commit secrets to the repository.

## Stripe & Cloudinary Integration

- Payments are processed securely via Stripe; webhooks verify payment status.
- Media uploads use Cloudinary for fast, global delivery and optimization.

## State Management

- Zustand is used for cart and wishlist state, providing fast and simple global state.

## Filtering & Performance

- Products are filtered and sorted client-side for responsiveness.
- Backend supports pagination and filtering for scalability.

## Security

- All sensitive operations use HTTPS.
- Payment and media credentials are kept secret.
- Authentication and protected routes are enforced via middleware.

## License

MIT

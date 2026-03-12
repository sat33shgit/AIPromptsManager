# AI Prompts Manager

AI Prompts Manager is a Next.js 15 application for organizing, searching, sharing, and reusing AI prompts. It supports categories, tags, model labels, prompt variables, usage tracking, public sharing, and optional file attachments stored in Cloudflare R2.

The app can run in two modes:

- With PostgreSQL configured, it uses Drizzle ORM for persistent storage.
- Without a database connection, it falls back to in-memory sample data so the UI still works for local exploration.

## Features

- Dashboard with recent, popular, and category-organized prompts
- Prompt create, edit, delete, copy, and share flows
- Full prompt metadata: category, tags, model, variables, attachments, visibility
- Search and filtering through API-backed prompt queries
- Optional private attachment storage via Cloudflare R2 signed URLs
- Sample data fallback when database configuration is missing

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Drizzle ORM with PostgreSQL
- Cloudflare R2 for attachments
- TanStack Query for client-side data fetching

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values you need.

```env
DATABASE_URL=
POSTGRES_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_PRISMA_URL=

# Cloudflare R2 Storage (private bucket - files served via signed URLs)
CLOUDFLARE_R2_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=promptsmanager

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Notes:

- For local development, `DATABASE_URL` is usually enough.
- On Vercel, the app can also use `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`, or `POSTGRES_PRISMA_URL`.
- If R2 variables are omitted, attachment metadata still works, but files are not uploaded to Cloudflare R2.

### 3. Set up the database

Push the schema to your PostgreSQL database:

```bash
npm run db:push
```

Optionally seed sample records:

```bash
npm run db:seed
```

### 4. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` starts the local Next.js development server
- `npm run build` creates a production build
- `npm run start` runs the production build
- `npm run lint` runs Next.js linting
- `npm run typecheck` runs TypeScript checks without emitting files
- `npm run db:push` pushes the Drizzle schema to PostgreSQL
- `npm run db:seed` seeds categories and prompts from sample data

## Environment and Storage Behavior

### Database resolution

The runtime and migration connection strings are selected from the available PostgreSQL environment variables. In local development, `DATABASE_URL` is preferred. In Vercel, the app prefers platform-provided Postgres variables first.

### Sample-data fallback

If no database connection string is available, the repository layer uses in-memory sample prompts and categories from `lib/data/sample-data.ts`. This is useful for UI development, but changes will not persist between restarts.

### Attachments

Attachments are stored as metadata on each prompt and can optionally be uploaded to Cloudflare R2.

- Maximum upload size: 10 MB
- Allowed content types:
  - `image/png`
  - `image/jpeg`
  - `image/webp`
  - `text/plain`
  - `text/markdown`
  - `application/json`
  - `application/pdf`

Files are served through signed download URLs rather than directly exposing the bucket.

## Project Structure

```text
app/                App Router pages and API routes
components/         UI, layout, prompt, and modal components
hooks/              Custom React hooks
lib/data/           Repository layer and sample data
lib/db/             Database connection and Drizzle schema
lib/r2/             Cloudflare R2 integration
lib/validations/    Zod schemas for request validation
scripts/            Database and maintenance scripts
store/              Client UI state
types/              Shared TypeScript types
```

## API Surface

Key routes implemented in the app:

- `GET /api/prompts` list prompts with filters, sorting, and pagination
- `POST /api/prompts` create a prompt
- `GET /api/prompts/:id` fetch a single prompt
- `PUT /api/prompts/:id` update a prompt
- `DELETE /api/prompts/:id` delete a prompt and clean up attachments
- `POST /api/upload` upload an attachment for a prompt
- `GET /api/upload/serve` serve an attachment via signed URL

## Rendering Note

The home dashboard is intentionally forced dynamic so production data stays fresh. The all-prompts view is client-fetched through the prompts API.

## Deployment

This project is suitable for Vercel deployment.

Before deploying, make sure:

- PostgreSQL environment variables are configured
- Cloudflare R2 variables are configured if attachments are required
- `NEXT_PUBLIC_APP_URL` matches the deployed origin

## Development Notes

- The repository layer abstracts both database-backed and fallback in-memory behavior.
- Prompt records include variables and attachments as JSON fields in PostgreSQL.
- Deleting a prompt also attempts to delete its stored R2 objects.
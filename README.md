# NDOC - Technical Documentation Platform

A full-featured technical documentation management platform built with Next.js 15, Drizzle ORM, and PostgreSQL.

## Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Database ORM:** Drizzle ORM
- **Database:** PostgreSQL via [@neondatabase/serverless](https://neon.tech)

## Features

- 📄 Document list with search and category filtering
- ✏️ Create, edit, and delete documents
- 🏷️ Tag support for documents
- 📂 Category management (create, edit, delete)
- 🔍 Full-text search by title and content

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.local.example` to `.env.local` and set your PostgreSQL connection string:

```bash
cp .env.local.example .env.local
```

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### 3. Run database migrations

```bash
npx drizzle-kit push
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── categories/        # Category CRUD API
│   │   └── documents/         # Document CRUD API (with search/filter)
│   ├── categories/            # Category management UI
│   ├── documents/
│   │   ├── [id]/              # Document detail & edit pages
│   │   └── new/               # Create document page
│   ├── layout.tsx
│   └── page.tsx               # Home page (document list)
├── db/
│   ├── index.ts               # Drizzle DB connection
│   └── schema.ts              # Database schema
└── types/
    └── index.ts               # Shared TypeScript types
```

## Database Schema

**categories** — `id`, `name` (unique), `description`, `createdAt`

**documents** — `id`, `title`, `content`, `categoryId` (FK → categories), `tags` (JSON array), `createdAt`, `updatedAt`

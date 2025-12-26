# BridalCompare

A production-ready comparison platform for South Asian brides to compare bridal outfits across multiple marketplaces.

## Features

- 🔗 Paste product URLs from 20+ bridal sites
- 📊 Compare outfits side-by-side
- 💾 Save to custom collections (Wedding, Sangeet, Mehendi, etc.)
- 📈 Discover trending items based on real user activity
- 🎨 Beautiful, modern South Asian bridal aesthetic

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Magic Link
- **Extraction:** Firecrawl API
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account
- A Firecrawl API key

### 1. Clone and Install

```bash
git clone <your-repo>
cd bridalcompare
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your keys
3. Go to SQL Editor and run the migration file: `supabase/migrations/20240101000000_initial_schema.sql`
4. Enable email auth in Authentication > Providers

### 3. Get Firecrawl API Key

1. Sign up at [firecrawl.dev](https://firecrawl.dev)
2. Get your API key from the dashboard

### 4. Configure Environment Variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FIRECRAWL_API_KEY=your-firecrawl-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/bridalcompare)

### Manual Deploy

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Project Structure

```
src/
├── app/              # Next.js app router pages & API routes
├── components/       # React components
│   ├── layout/      # Header, Footer, AdSlot
│   ├── compare/     # Comparison UI
│   ├── collections/ # Collection management
│   ├── trending/    # Trending section
│   ├── ui/          # Reusable UI components
│   └── auth/        # Auth modal
├── lib/             # Utilities & external services
└── types/           # TypeScript types
```

## Key Features Explained

### URL Extraction

- Users paste 1-20 product URLs
- Firecrawl Extract API pulls structured data
- Results cached for 24 hours
- Per-URL error handling (one bad URL doesn't break the batch)

### Collections

- Authenticated users can save products
- Pre-set collections: Wedding, Sangeet, Mehendi, Reception
- Custom collections supported
- One-click save from any product card

### Trending Analytics

- Tracks paste_count, compare_count, save_count per product
- "Trending in BridalCompare" shows top items from last 7 days
- All metrics aggregated anonymously

### Monetization Ready

- Ad slots in sidebar (desktop) and inline (mobile)
- Featured product placements
- Affiliate link wrapper function ready for commission links

## Configuration

### Firecrawl Setup

The extraction service uses Firecrawl's Extract API with schema-based extraction. Configure in `src/lib/firecrawl.ts`. No per-site selectors needed.

### Affiliate Links

Update `src/lib/affiliate.ts` to add affiliate parameters per domain when ready to monetize.

## Support

For issues or questions, please open a GitHub issue.

## License

MIT
# bridalcompare

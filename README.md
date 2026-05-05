<div align="center">

<h1>
  <img src="https://img.shields.io/badge/Editz-AI%20Media%20Editor-a855f7?style=for-the-badge&labelColor=1a1a2e" alt="Editz"/>
</h1>

<p align="center">
  <strong>AI-powered media editing platform — remove objects, swap backgrounds, recolor, resize, and compress — all in the browser.</strong>
</p>

<p align="center">
  <a href="https://algo-arena-livid.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-▶%20View%20App-a855f7?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"/>
  </a>
</p>

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js%2014-black?style=flat-square&logo=next.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white"/>
  <img src="https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/>
</p>

</div>

---

## What is Editz?

Editz is a full-stack AI media editor that lets users upload images and videos and apply powerful transformations — all powered by Cloudinary's AI pipeline. No Photoshop. No installs. Just upload and edit.

Users can remove objects from photos using a text prompt, strip backgrounds in one click, recolor specific objects, crop images to any social media format, and compress videos — with side-by-side before/after previews and one-click downloads.

---

## Features

| Feature | Description |
|---|---|
| 🧹 **Object Removal** | Type what you want removed (e.g. "car", "person") — Cloudinary's generative AI erases it and fills in the background |
| 🎨 **Object Recoloring** | Specify an object and a target color — AI repaints it while preserving texture and lighting |
| ✂️ **Background Removal** | Isolate any subject from its background with a single click |
| 📐 **Aspect Ratio Change** | Crop images to exact dimensions for Instagram, Twitter, LinkedIn banners, and more — with AI-powered smart gravity |
| 🎬 **Video Compression** | Upload a video and get a compressed MP4 back — with original vs. compressed size comparison and compression percentage |
| 📦 **Video Gallery** | Browse and replay all uploaded videos with hover-to-preview, thumbnails, and download |

---

## Tech Stack

### Frontend
- **Next.js 14** — App Router, Server Components, API Routes
- **TypeScript** — end-to-end type safety
- **Tailwind CSS + DaisyUI** — utility-first styling
- **next-cloudinary** — `<CldImage>` for URL-based transformations rendered via Cloudinary CDN

### Backend
- **Next.js API Routes** — serverless handlers for all upload and transformation logic
- **Cloudinary Node SDK** — streams raw file buffers directly to Cloudinary, applies AI transformations at upload time
- **Prisma ORM** — type-safe database client
- **PostgreSQL** — persists video metadata (title, publicId, original/compressed sizes)

### Auth & Infrastructure
- **Clerk** — authentication with middleware-level route protection
- **Vercel** — deployment and edge functions

---

## How It Works

### Image Transformation Flow

The browser never talks to Cloudinary directly. All uploads go through a Next.js API route that holds the Cloudinary secret server-side.

```
User selects file
      ↓
Browser → POST /api/image-upload (FormData)
      ↓
API Route: File → ArrayBuffer → Node Buffer → cloudinary.upload_stream()
      ↓
Cloudinary stores image, returns { public_id }
      ↓
Browser receives publicId, stores in React state
      ↓
<CldImage src={publicId} crop="fill" gravity="auto" removeBackground />
      ↓
next-cloudinary builds URL:
  https://res.cloudinary.com/{cloud}/image/upload/
    c_fill,g_auto,w_1080,h_1080/e_background_removal/{publicId}
      ↓
Cloudinary CDN processes + caches the transformation
Browser renders the result
```

For AI tools (object removal, recoloring), the transformation is applied **at upload time** by passing Cloudinary's generative AI effects directly in `upload_stream` options — so the stored image is already the final result.

### Video Compression Flow

```
User uploads video + metadata
      ↓
POST /api/video-uploadz
      ↓
Cloudinary compresses with { quality: "auto", fetch_format: "mp4" }
Returns compressed bytes and public_id
      ↓
Prisma writes Video record to PostgreSQL:
  { publicId, title, originalSize, compressedSize }
      ↓
VideoCard renders:
  - Thumbnail via getCldImageUrl() (video frame extraction)
  - Hover preview via getCldVideoUrl() with e_preview transformation
  - Compression ratio calculated: (1 - compressed/original) × 100
```

---

## Project Structure

```
editz/
├── src/
│   ├── app/
│   │   ├── (app)/                      # Protected app routes
│   │   │   ├── object-removal/         # Gen-AI object eraser
│   │   │   ├── object-recoloring/      # Gen-AI color replacement
│   │   │   ├── background-removal/     # Background stripper
│   │   │   ├── aspect-ratio-change/    # Smart crop + resize
│   │   │   ├── video-compression/      # Video upload + compress
│   │   │   └── home/                   # Video gallery
│   │   ├── (auth)/                     # Sign-in / Sign-up pages
│   │   └── api/
│   │       ├── image-upload/           # Generic image upload route
│   │       ├── remove-object/          # AI object removal
│   │       ├── replace-color/          # AI object recoloring
│   │       ├── video-uploadz/          # Video upload + Prisma write
│   │       └── videos/                 # Fetch all videos
│   ├── components/
│   │   ├── Video-Card.tsx              # Thumbnail/preview/download card
│   │   ├── Gallery.tsx                 # Static example gallery
│   │   ├── ToolsSection.tsx            # Tool cards with routing
│   │   ├── header.tsx / footer.tsx
│   │   └── hero.tsx
│   ├── lib/
│   │   └── prisma.ts                   # Prisma client singleton
│   ├── types/index.ts                  # Shared TypeScript interfaces
│   └── middleware.ts                   # Clerk auth middleware
└── prisma/
    └── schema.prisma                   # Video model definition
```

---

## Database Schema

Only video metadata is persisted — images are stateless (publicId stored only in React state).

```prisma
model Video {
  id             String   @id @default(cuid())
  title          String
  description    String?
  publicId       String               // Cloudinary asset identifier
  originalSize   String               // Pre-compression file size (bytes)
  compressedSize String               // Post-compression file size (bytes)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account
- Clerk account

### Environment Variables

```env
# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
NEXT_PUBLIC_CLOUDINARY_API_SECRET=your_api_secret

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database
DATABASE_URL=postgresql://user:password@host:5432/editz
```

### Installation

```bash
git clone https://github.com/aarbid29/Editz.git
cd Editz
npm install

# Push database schema
npx prisma migrate dev --name init

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Key Design Decisions

**Cloudinary as the transformation engine** — Rather than running image processing on the server (sharp, ffmpeg, etc.), all transformations are delegated to Cloudinary's CDN. This means zero compute cost on the Next.js server and automatic CDN caching of every transformation result.

**Server-side upload proxy** — The browser always POSTs to a Next.js API route, never to Cloudinary directly. This keeps the `api_secret` off the client and allows adding auth checks, rate limiting, and validation before any data reaches Cloudinary.

**URL-based rendering** — For non-AI transformations (crop, resize, background removal), no server round-trip is needed after the initial upload. `<CldImage>` builds a transformation URL from props, and Cloudinary's CDN handles the rest. Changing the selected aspect ratio just re-renders the component with new dimensions — it's a new URL, not a new API call.

**Prisma only for videos** — Images are ephemeral by design. The publicId is held in React state for the session. Videos get persisted because the gallery page needs to list them later with metadata.

---


## License

MIT © [aarbid29](https://github.com/aarbid29)

---

<div align="center">
  <p>Built with Next.js · Cloudinary · Clerk · Prisma</p>
  <p>
    <a href="https://github.com/aarbid29/Editz">⭐ Star this repo if you found it useful</a>
  </p>
</div>

# Static Public Portfolio Architecture

## Request Flow

Public visitors no longer call the Render API.

```text
Visitor -> Netlify React app -> /data/portfolio.json -> Cloudinary image URLs
```

The admin dashboard still uses the backend.

```text
Artist -> /admin -> Render Express API -> MongoDB Atlas -> Cloudinary
```

## Data Publishing Flow

1. The artist edits artwork, profile, logo, or settings in the admin dashboard.
2. The Express API saves the change in MongoDB or Cloudinary.
3. The API calls `NETLIFY_BUILD_HOOK_URL` when that environment variable is set.
4. Netlify starts a new frontend build.
5. `npm run build` runs `scripts/generate-public-data.mjs`.
6. That script fetches `${VITE_API_URL}/public-data` and writes `public/data/portfolio.json`.
7. Vite builds and deploys the static site.

Render cold starts can still happen during admin work or Netlify builds, but not during normal visitor page loads.

## Folder Structure

```text
backend/
  routes/
    publicData.js          # JSON snapshot endpoint for Netlify builds
  utils/
    publicSnapshot.js      # Reads MongoDB and builds static public payload
    staticRebuild.js       # Optional Netlify build-hook trigger

frontend/
  public/
    data/portfolio.json    # Generated public portfolio snapshot
    _headers               # Cache rules
    _redirects             # SPA fallback
  scripts/
    generate-public-data.mjs
  src/
    services/
      api.js               # Admin/backend API client
      publicData.js        # Public static JSON client
      netlifyForms.js      # Public form submission to Netlify Forms
```

## Production Environment Variables

Netlify frontend:

```text
VITE_API_URL=https://your-render-service.onrender.com/api
PUBLIC_DATA_EXPORT_KEY=optional-shared-secret
```

Render backend:

```text
FRONTEND_URL=https://your-netlify-site.netlify.app
NETLIFY_BUILD_HOOK_URL=https://api.netlify.com/build_hooks/...
PUBLIC_DATA_EXPORT_KEY=same-optional-shared-secret
```

If `PUBLIC_DATA_EXPORT_KEY` is set on Render, Netlify must set the same value so the build can fetch the snapshot.

## Feature Change

Public contact and artwork inquiry forms now submit to Netlify Forms instead of `/api/inquiries`. This is intentional: saving inquiries through Express would reintroduce a Render dependency for visitors.

Best low-cost alternatives:

- Use Netlify Forms email notifications as the primary inbox.
- Add Zapier/Make/Netlify Function later to sync Netlify submissions into MongoDB.
- Keep the old admin inquiries screen for historical MongoDB inquiries or future admin-created records.

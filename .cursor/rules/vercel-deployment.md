---
alwaysApply: true
---

# Vercel Deployment Configuration Rules

## CRITICAL: Never create vercel.json files for Next.js apps

- Next.js on Vercel is zero-config
- vercel.json files override Vercel's auto-detection
- This causes 404 errors and build failures
- If you need API routes, use Vercel Functions in /api directory

## Monorepo Structure Requirements

- Root Directory in Vercel: `apps/frontend`
- Root package.json must have: `"packageManager": "pnpm@9.9.0"`
- pnpm-lock.yaml must be at repository root
- Never use `cd apps/frontend &&` in Vercel commands when Root Directory is set

## Vercel Dashboard Settings (DO NOT OVERRIDE)

- Root Directory: `apps/frontend`
- Framework Preset: `Next.js`
- Build Command: Leave default (Vercel auto-detects)
- Install Command: Leave default (Vercel auto-detects pnpm)
- Output Directory: Leave default (Vercel handles .next)
- Development Command: Leave default

## Build Commands Rules

- Vercel runs commands FROM the Root Directory
- If Root Directory = `apps/frontend`, commands run from that directory
- Never use `cd apps/frontend &&` when Root Directory is already set
- This causes "No such file or directory" errors

## Package Manager Configuration

- Use pnpm for this project
- Root package.json must specify: `"packageManager": "pnpm@9.9.0"`
- Vercel will auto-detect pnpm from pnpm-lock.yaml and packageManager field

## File Structure Requirements

```
project-root/
├── package.json (with packageManager field)
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── apps/
    └── frontend/ (Vercel Root Directory)
        ├── package.json
        ├── next.config.ts
        └── src/app/
```

## Deployment Checklist

1. ✅ No vercel.json files
2. ✅ Root Directory set to `apps/frontend`
3. ✅ Framework Preset = Next.js
4. ✅ Build/Install commands use defaults
5. ✅ packageManager field in root package.json
6. ✅ pnpm-lock.yaml at repository root

## Common Mistakes to Avoid

- ❌ Creating vercel.json with outputDirectory
- ❌ Using `cd apps/frontend &&` in commands when Root Directory is set
- ❌ Overriding Vercel's auto-detection
- ❌ Using npm commands when pnpm is detected
- ❌ Setting custom outputDirectory for Next.js

## If You Must Use vercel.json

Only for API routes or special cases:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://backend-project.vercel.app/api/$1"
    }
  ]
}
```

## Troubleshooting 404 Errors

1. **Check Root Directory**: Must be `apps/frontend`
2. **Check Framework Preset**: Must be `Next.js`
3. **Remove vercel.json files**: Next.js is zero-config
4. **Check build commands**: Remove `cd apps/frontend &&` prefixes
5. **Verify packageManager**: Must be in root package.json

## Development Commands

- Frontend: `cd apps/frontend && npm run dev`
- Backend: `cd apps/backend && poetry run uvicorn src.backend.main:app --reload`
- Root: Use pnpm for workspace management

## Testing Commands

- Local build: `cd apps/frontend && npm run build`
- Local start: `cd apps/frontend && npm start`
- Test in incognito to avoid auth issues

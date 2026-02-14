# Fawasel PDF to Website

React + Vite bilingual scrollytelling website generated from `1 (1) (1).pdf`.

## Stack

- React + TypeScript + Vite
- Framer Motion (high-motion transitions)
- i18next + react-i18next (Arabic/English toggle)
- Sharp (responsive image optimization)
- Tesseract.js + Google Translate API (raw OCR/translation pipeline)
- Vitest + Testing Library + Playwright

## Quick Start

Windows PowerShell (execution policy blocks `npm` script shim on some systems):

```powershell
npm.cmd install
npm.cmd run assets:build
npm.cmd run content:pipeline
npm.cmd run dev
```

## Scripts

- `npm run dev`: start dev server
- `npm run build`: TypeScript + Vite production build
- `npm run build:site`: full pipeline then build
- `npm run assets:extract`: extract 18 embedded JPG pages from PDF
- `npm run assets:manifest`: generate `src/content/pageManifest.ts`
- `npm run assets:optimize`: create responsive JPG/WebP variants + `/public/assets/manifest.json`
- `npm run assets:build`: run all asset pipeline steps
- `npm run content:ocr`: OCR semantic-core Arabic sections into `src/content/raw/ocr-ar.json`
- `npm run content:translate`: auto-translate OCR output to English into `src/content/raw/ocr-en.auto.json`
- `npm run content:build`: normalize validated content into `src/content/site.ar.json` and `src/content/site.en.json`
- `npm run content:pipeline`: run all content pipeline steps
- `npm run test`: run unit/component tests
- `npm run test:e2e`: run Playwright smoke tests

## Project Structure

- `scripts/`: reproducible PDF/image/content pipeline scripts
- `public/assets/raw/`: extracted page images (`page_01.jpg` ... `page_18.jpg`)
- `public/assets/optimized/`: responsive optimized variants
- `public/assets/manifest.json`: runtime asset manifest
- `src/content/pageManifest.ts`: logical page-to-section mapping
- `src/content/site.ar.json`: Arabic website content
- `src/content/site.en.json`: English website content

## Vercel Deployment

1. Import the repo/project into Vercel.
2. Build command: `npm run build:site`
3. Output directory: `dist`
4. `vercel.json` already contains SPA rewrite and asset caching headers.

## Notes

- Raw OCR/translation files are generated for iterative copy refinement.
- Final visible website copy is normalized and curated for clean presentation.

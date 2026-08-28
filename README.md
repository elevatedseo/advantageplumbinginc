# Advantage Plumbing Astro rebuild

Clean static rebuild of `https://advantageplumbinginc.com/`.

## Requirements

- Node.js 22.12 or newer
- npm

## Local setup

```powershell
npm install
npm run check
npm run build
npm run dev
```

## Security boundary

The source WordPress installation shows signs of compromise. Do not import or execute WordPress PHP, plugins, themes, JavaScript, shortcodes, database exports, archives, SVG files, or unknown assets.

Only publicly verified business content and validated, re-encoded raster media may enter this repository. Unrelated casino, gambling, pharmaceutical, backlink, or other injected content must be excluded.

## Migration approach

1. Inventory legitimate public navigation, pages, SEO metadata, and content.
2. Download raster media into a separate untrusted staging area.
3. Validate file signatures and dimensions, scan, and re-encode approved images.
4. Rebuild reusable layouts and components in clean Astro.
5. Preserve verified URL paths and metadata.
6. Run `npm run check` and `npm run build` before every deployment.

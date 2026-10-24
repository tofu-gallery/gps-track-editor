# Tofu gallery copy

This repository is Tofu's copy of **gpxstudio/gpx.studio** (licence: MIT), listed in Tofu's app gallery as **GPS track editor**.

Based on GPX Studio (https://github.com/gpxstudio/gpx.studio), by the gpx.studio authors.

- `main` mirrors the upstream repository and is never committed to by Tofu.
- `tofu` carries Tofu's own changes; tags named `pin/<date>` mark the versions the gallery points to.
- A visitor who chooses this app gets a private snapshot of the pinned version in their own Tofu account. Their copy does not follow upstream updates.

How Tofu runs it: SvelteKit, built from the repository root (import the whole repository, not `website/`: the site depends on the `gpx` library beside it). Listed under a plain name: the licence does not grant the upstream name or logo.

## What Tofu changes

Build at the repository root
- `package.json` (new): a root build that runs the original deploy workflow's steps in order: `npm ci` in `gpx/` (its postinstall compiles the library), `npm ci` in `website/`, then the website's own `npm run build`. It declares `@sveltejs/kit` as an optional peer dependency only so Tofu's detector picks the SvelteKit preset at the root; nothing is installed at the root. `engines.node` is `>=22` because some locked dependencies require Node 22 and `website/.npmrc` sets `engine-strict`.
- `package-lock.json` (new): the matching root lockfile (no packages), so the root installs from a lockfile.
- `vercel.json` (new): `outputDirectory: website/build`, where `@sveltejs/adapter-static` writes the site; the SvelteKit preset would otherwise look for `public/`.
- `vercel.json`: `cleanUrls: true` (2026-10-24). `@sveltejs/adapter-static` writes each page as a file (`app.html`, `help.html`, `fr/app.html`); without it the host answered `/app` with 404 and only `/app.html` opened, which a live copy showed. With it, each page answers at the address the site links to (`/app`, `/help`, `/fr/app`), and `/app.html` redirects there.

Runs without a secret, at a bare address
- `website/svelte.config.js`: base path fixed to empty (was `BASE_PATH`), and `PUBLIC_MAPTILER_KEY` and `PUBLIC_GOOGLE_DRIVE_KEY` default to an empty string so the `$env/static/public` imports build without a key. No default style needs MapTiler any more.
- `website/src/lib/components/embedding/embedding.ts` and `website/src/routes/[[language]]/app/+page.svelte`: the original site's Google API key is removed. A copy should not use the original project's key, and Tofu's safety check blocks a deployment that carries a committed Google API key. The app used it to download Google Drive files named in `ids=` links, in the app and in embedded maps. Those files now download only when the copy's owner sets `PUBLIC_GOOGLE_DRIVE_KEY` to a Google API key of their own (Google Drive API enabled, restricted to the copy's address; like the original key, it is visible in the page). Without it, an `ids=` link opens the app or the embedded map without those files and logs one console warning; files opened by address (`files=`) and everything else work as before.

Maps, terrain, routing and points of interest
- `website/src/lib/assets/layers.ts`: the four styles served from `styles.gpx.studio` (the original site's tiles, fonts and sprites, plus a MapTiler key for satellite) are replaced. `libertyTopo` (the default) is OpenFreeMap Liberty and `osm` is OpenFreeMap Bright. `libertySatellite` now opens Esri World Imagery and `osmTopo` opens OpenTopoMap; both are hidden from the layer menus (they stay as names so old embed links still open a map), and Esri imagery is shown in the menu by default instead. The 3D terrain source uses Mapterhorn's public endpoint instead of the original site's mirror (`tiles.gpx.studio`). The menu label "Liberty Topo" now shows Liberty without contour lines; the Mapterhorn hillshade overlay is still available.
- `website/src/lib/utils.ts`: elevation lookups read Mapterhorn's public tiles instead of `tiles.gpx.studio`.
- `website/src/lib/components/toolbar/tools/routing/routing.ts`: every activity routes through the public BRouter server (`brouter.de`) with its nearest built-in profile (bike: trekking, road bike: fastbike, gravel: gravel, mountain bike: mtb, foot: hiking-mountain, motorcycle: car-vario; water and railway were already BRouter). The original site's GraphHopper server is no longer called; its code is left in place, unused. The "allow private roads" switch only applied to GraphHopper and now has no effect.
- `website/src/lib/components/map/layer-control/overpass-layer.ts`: points of interest come from the public Overpass API (`overpass-api.de`) instead of `overpass.gpx.studio`.

Street view removed
- `website/src/routes/[[language]]/app/+page.svelte`: the street view control is no longer mounted.
- `website/src/lib/components/Menu.svelte`: the street view source menu is removed.
- Deleted `website/src/lib/components/map/street-view-control/StreetViewControl.svelte`, `mapillary.ts` (it carried the original site's Mapillary token) and `google.ts`. `utils.ts` in that folder stays because the routing code reads its flag, which is now always off.

Name and logo
- `website/src/hooks.server.js`: page titles and social tags say "GPS track editor"; tags that pointed at gpx.studio's address, image, social accounts and language alternates are removed.
- `website/src/routes/+layout.svelte`: the browser tab title says "GPS track editor".
- `website/static/logo.svg`, `logo-dark.svg`, `icon.svg`, `icon-dark.svg`, `pwa-icon.svg`: replaced with a neutral route mark and the plain name. Deleted `favicon.png`, `apple-touch-icon.png` and `og_logo.png` (the original logo).
- `website/src/app.html`: the favicon is `icon.svg`; the Apple touch icon link is removed with its file.
- `website/src/lib/components/Logo.svelte`: alt text is "GPS track editor".
- `website/static/en.manifest.webmanifest` and `website/src/lib/scripts/pwa-manifest.ts`: the installed app is named "GPS track editor", with relative ids instead of gpx.studio addresses. (The manifest is JSON and cannot carry a comment; this note is its record.)
- `website/src/lib/components/Footer.svelte`: adds a "Based on GPX Studio" link beside the unchanged "MIT © 2026 gpx.studio" licence notice; removes the Contact column (the original project's Reddit, Facebook and email), keeping its `contact` anchor on the Contribute column because the help pages link to it.
- `website/src/routes/[[language]]/+page.svelte`: the screenshot's alt text says "GPS track editor".
- `website/src/lib/components/map/Map.svelte`: the "create a map for your website" link opens this copy's own help page.
- `website/src/lib/components/embedding/EmbeddingPlayground.svelte`: the embed code names this copy's own address instead of gpx.studio.
- `website/src/lib/scripts/sitemap.ts` and `website/static/robots.txt`: the sitemap used gpx.studio addresses; it is now written only when `SITE_URL` (this copy's address, optional) is set, and robots.txt no longer names gpx.studio's sitemap.

Left as they are, on purpose
- The help docs (`website/src/lib/docs`: 693 files in 33 languages, about 2.9 MB, plus about 2.6 MB of screenshots under `website/src/lib/assets/img/docs`) are kept; 230 of those files still mention "gpx.studio" in their text. The import limit (20,000 files, 250 MB) is far above the repository's 1,100-odd files.
- Links that credit or support the original project stay: Donate (Open Collective), Crowdin and GitHub in the menu, footer and home page, and the home page's community paragraph that names gpx.studio.
- `README.md`, `LICENSE`, `crowdin.yml` and `.github/` are unchanged.

## Map, data and routing providers

All of these are called from the visitor's browser without a key. None is run by Tofu or by the original project.

- OpenFreeMap (`tiles.openfreemap.org`), default and "OSM" styles: free, no key or registration, no published request limit. Attribution "OpenFreeMap © OpenMapTiles Data from OpenStreetMap" is carried in the style. Map data © OpenStreetMap contributors (ODbL).
- Mapterhorn (`tiles.mapterhorn.com`), terrain, hillshade and elevation: open terrain tiles, no key. Attribution "© Mapterhorn" and its sources, per https://mapterhorn.com/attribution.
- Esri World Imagery (`services.arcgisonline.com`), satellite: unchanged from the original project; Esri's terms of use apply and its attribution is shown.
- OpenStreetMap tiles (`tile.openstreetmap.org`) and OpenTopoMap: unchanged; the OSMF tile usage policy and OpenTopoMap's CC-BY-SA terms apply (light, interactive use with attribution).
- BRouter (`brouter.de`), routing: the public server run by BRouter's author, best effort with no service guarantee; heavy use should run its own BRouter.
- Overpass API (`overpass-api.de`), points of interest: public instance; its usage policy asks for fewer than about 10,000 queries and 1 GB per day per user.
- Every other layer (IGN France, Spain and Belgium, swisstopo, LINZ, USGS, Waymarked Trails, CyclOSM, OpenHikingMap, Utagawa VTT and the rest) is unchanged from the original project and keeps its own terms. The LINZ layers carry an API key that the original project put in the code.

## Needs a real deploy to verify

- Tofu imports the repository root, detects SvelteKit from the root `package.json`, and the build runs the root `build` script: `npm ci` succeeds in `gpx/` and in `website/` on the build's Node version (22 or newer), and `gpx/dist` exists before the website builds.
- The site is served from `website/build` (via `vercel.json`); `/`, `/app`, `/help`, `/help/integration`, `/embed` and a language version such as `/fr/app` all load, and the build log shows no prerender failures.
- The map loads OpenFreeMap Liberty with no MapTiler key set, track labels and distance markers render (Noto Sans from OpenFreeMap), and the browser's network panel shows no request to any `*.gpx.studio` host.
- Routing works through `brouter.de` for each activity, including the error messages for unreachable points.
- Elevation for points added without routing, the elevation profile and 3D terrain work with `tiles.mapterhorn.com`.
- Points of interest load from `overpass-api.de`.
- No street view button or menu item appears.
- Favicon, light and dark logos, and the installed app's name read "GPS track editor".
- The embed page's code shows the copy's own address.
- With a `PUBLIC_GOOGLE_DRIVE_KEY` of the owner's own, a public Google Drive file named in an `ids=` link opens in the app and in an embedded map.

## Verification

2026-10-23, after removing the Google API key:
- Tofu's safety check, run on this version imported the way Tofu's GitHub import does, reports no finding (`safety ok`).
- A copy shaped like Tofu's import (no `node_modules`, `dist` or `build`) builds with the root `npm run build` on Node 22 with no settings set, and the built site contains no Google API key.
- Served locally with `vite preview`, `/app` opened a test track given in `files=` (map, track, name, distance, climb and elevation profile) while an `ids=` Drive id in the same link was skipped with the one console warning; no console errors, no failed requests, and no request to `www.googleapis.com` or any `gpx.studio` host (only the site itself, `tiles.openfreemap.org` and `tiles.mapterhorn.com`). `/embed` with the same kind of links did the same.

## Licence

MIT. Licence files and copyright notices stay as they are; every file Tofu changes carries a note saying so, except JSON files, which cannot hold comments and are listed above.

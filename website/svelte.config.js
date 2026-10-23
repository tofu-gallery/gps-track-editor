import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

// Tofu: every default map style in this copy is keyless, so a build without a MapTiler key
// reads it as an empty string instead of failing the `$env/static/public` import.
process.env.PUBLIC_MAPTILER_KEY ??= '';
// Tofu: the original site's Google API key is removed; Google Drive files open only when this
// copy's owner sets a browser key of their own. Unset, it builds as an empty string.
process.env.PUBLIC_GOOGLE_DRIVE_KEY ??= '';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
    extensions: ['.mdx'],
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte', ...mdsvexOptions.extensions],
    preprocess: [vitePreprocess({ script: true }), mdsvex(mdsvexOptions)],
    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            precompress: false,
            strict: true,
        }),
        paths: {
            // Tofu: the copy is served at the root of its own address, so the base path is empty.
            base: '',
            relative: false,
        },
        prerender: {
            crawl: true,
        },
    },
};

export default config;

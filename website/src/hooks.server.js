import { base } from '$app/paths';
import { languages } from '$lib/languages';
import { getURLForLanguage } from '$lib/utils';

export async function handle({ event, resolve }) {
    const language = event.params.language ?? 'en';
    const strings = await import(`./locales/${language}.json`);

    const path = event.url.pathname;
    const page = event.route.id?.replace('/[[language]]', '').split('/')[1] ?? 'home';

    let title = strings.metadata[`${page}_title`];
    const description = strings.metadata[`description`];

    if (page === 'help' && event.params.guide) {
        const [guide, subguide] = event.params.guide.split('/');
        const guideModule = subguide
            ? await import(`./lib/docs/${language}/${guide}/${subguide}.mdx`)
            : await import(`./lib/docs/${language}/${guide}.mdx`);
        title = `${title} | ${guideModule.metadata.title}`;
    }

    const htmlTag = `<html lang="${language}" translate="no">`;

    // Tofu: this copy is not gpx.studio. The product name is neutral, and the tags that pointed at
    // the original site's address, image, social accounts and language alternates are removed
    // (a copy does not know its own address at build time).
    let headTag = `<head>
    <title>GPS track editor — ${title}</title>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "GPS track editor"
    }
    </script>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="GPS track editor — ${title}" />
    <meta property="og:description" content="${description}" />
    <meta name="twitter:title" content="GPS track editor — ${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="GPS track editor" />
    <meta name="twitter:card" content="summary" />
    <link rel="manifest" href="/${language}.manifest.webmanifest" />`;

    const response = await resolve(event, {
        transformPageChunk: ({ html }) =>
            html.replace('<html>', htmlTag).replace('<head>', headTag),
    });

    return response;
}

<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import LanguageSelect from '$lib/components/LanguageSelect.svelte';
    import ModeSwitch from '$lib/components/ModeSwitch.svelte';
    import Logo from '$lib/components/Logo.svelte';
    import { AtSign, BookOpenText, Heart, House, Map } from '@lucide/svelte';
    import { i18n } from '$lib/i18n.svelte';
    import { getURLForLanguage } from '$lib/utils';
</script>

<footer class="w-full px-12 py-10 border-t flex flex-col items-center">
    <div class="w-full max-w-5xl flex flex-row flex-wrap justify-between gap-x-10 gap-y-6">
        <div class="grow flex flex-col items-start">
            <Logo class="h-8" width="153" />
            <!-- Tofu: credit line for the project this copy is based on; the licence notice stays. -->
            <Button
                variant="link"
                class="h-6 px-0 has-[>svg]:px-0 text-muted-foreground"
                href="https://github.com/gpxstudio/gpx.studio"
                target="_blank"
            >
                Based on GPX Studio
            </Button>
            <Button
                variant="link"
                class="h-6 px-0 has-[>svg]:px-0 text-muted-foreground"
                href="https://github.com/gpxstudio/gpx.studio/blob/main/LICENSE"
                target="_blank"
            >
                MIT © 2026 gpx.studio
            </Button>
            <div class="mt-3 flex flex-row gap-1.5">
                <LanguageSelect />
                <ModeSwitch />
            </div>
        </div>
        <div class="grow max-w-2xl flex flex-row flex-wrap justify-between gap-x-10 gap-y-6">
            <div class="flex flex-col items-start gap-1">
                <span class="font-semibold">{i18n._('homepage.website')}</span>
                <Button
                    variant="link"
                    class="h-6 px-0 has-[>svg]:px-0 text-muted-foreground"
                    href={getURLForLanguage(i18n.lang, '/')}
                >
                    <House size="16" />
                    {i18n._('homepage.home')}
                </Button>
                <Button
                    data-sveltekit-reload
                    variant="link"
                    class="h-6 px-0 has-[>svg]:px-0 text-muted-foreground"
                    href={getURLForLanguage(i18n.lang, '/app')}
                >
                    <Map size="16" />
                    {i18n._('homepage.app')}
                </Button>
                <Button
                    variant="link"
                    class="h-6 px-0 has-[>svg]:px-0 text-muted-foreground"
                    href={getURLForLanguage(i18n.lang, '/help')}
                >
                    <BookOpenText size="16" />
                    {i18n._('menu.help')}
                </Button>
            </div>
            <!-- Tofu: the Contact column (the original project's Reddit, Facebook and email) is
                 removed, so visitors of this copy are not sent to the original author for support.
                 Its `contact` id moves here: the help pages link to it, and the build checks them. -->
            <div class="flex flex-col items-start gap-1" id="contact">
                <span class="font-semibold">{i18n._('homepage.contribute')}</span>
                <Button
                    variant="link"
                    class="h-6 px-0 has-[>svg]:px-0 text-muted-foreground"
                    href="https://opencollective.com/gpxstudio"
                    target="_blank"
                >
                    <Heart size="16" />
                    {i18n._('menu.donate')}
                </Button>
                <Button
                    variant="link"
                    class="h-6 px-0 has-[>svg]:px-0 text-muted-foreground"
                    href="https://crowdin.com/project/gpxstudio"
                    target="_blank"
                >
                    <Logo company="crowdin" class="h-4 fill-muted-foreground" />
                    {i18n._('homepage.crowdin')}
                </Button>
                <Button
                    variant="link"
                    class="h-6 px-0 has-[>svg]:px-0 text-muted-foreground"
                    href="https://github.com/gpxstudio/gpx.studio"
                    target="_blank"
                >
                    <Logo company="github" class="h-4 fill-muted-foreground" />
                    {i18n._('homepage.github')}
                </Button>
            </div>
        </div>
    </div>
</footer>

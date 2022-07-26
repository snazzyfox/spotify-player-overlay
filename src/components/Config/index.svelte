<main class="config-container">
    <h1>Spotify Player Overlay</h1>

    {#if navigator.userAgent.match(/\bOBS\b/)}
    <div class="mbe16">
        <Alert type="warning">
            It looks like you are loading this page in OBS. This is now the page that helps you configure the OBS plugin. 
            Please visit this URL in your desktop browser instead.
        </Alert>
    </div>
    {/if}

    <section class="mbe16">
        <SpotifyLogin/>
    </section>
    
    <section class="mbe16">
        <TwitchConfig/>
    </section>

    <section class="mbe16">
        <h1 class="mbe8">Your Widget URL</h1>
        <p>Click the button below to generate a widget URL that you can use in your streaming software. 
            You can add this URL as a browser source.</p> 
        <p class="mbe8">The adapts to the size of your source, so make sure you set the source to the size you need it to be. Avoid scaling the source within
            OBS since that can create aliasing. A good size to start with is 600x240.</p>
        <Button type="primary" on:click={setConfString}>Generate</Button>
        {#if widgetUrl}
        <textarea class="mbs8">{ widgetUrl }</textarea>
        {/if}
    </section>

</main>

<script lang="ts">
    import { Alert, Button, Dialog } from 'agnostic-svelte';
    import { dumpState } from '../../stores';
    import SpotifyLogin from './Spotify.svelte'
    import TwitchConfig from './Twitch.svelte'
    import { spotifySignedIn } from '../../stores'

    let widgetUrl: string = '';

    function setConfString() {
        if ($spotifySignedIn) {
            const url = new URL(window.location.href);
            url.hash = '#widget'
            url.search = dumpState();
            widgetUrl = url.toString();
        } else {
            widgetUrl = 'You must sign in to Spotify first.'
        }
    }
</script>

<style lang="less">
    .config-container {
        margin: 10vh auto;
        max-width: 1000px;
    }

    textarea {
        display: block;
        width: 100%;
        height: 4em;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style>
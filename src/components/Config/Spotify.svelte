<h2>Connect Spotify</h2>
<p class="mbe16">Connect your Spotify account so that this tool can read your player activity.</p>

<Dialog 
    id="spotify-info"
    dialogRoot="#dialog-root" 
    isAnimationFadeIn isAnimationSlideUp
    title="Spotify Client ID"
    on:instance={e => dialog = e.detail.instance} 
>
    <p>Spotify's policy does not allow for certifying hobby projects, so I cannot build an application with one included 
        and reusable by everyone. You must to create a Spotify Client ID in order to let this tool read your current playing track.</p>
    <ol>
        <li>Go to the 
            <a href="https://developer.spotify.com/console/" rel="noreferer noopener" target="_blank">Spotify Developer Console</a>
            and log in with your Spotify account.</li>
        <li>Go to "Dashboard", then "Create An App".</li>
        <li>Enter a name and description (anything goes), then click create.</li>
        <li>Click on "Edit Settings", and find "Redirect URIs". Add this tool <code>https://snazzyfox.github.io/spotify-player-overlay/#callback</code> 
            to the list. Make sure you enter the URL exactly as shown here, without leading or trailing spaces, and include the trailing slash.</li>
        <li>On the App's information page, you will find the "Client ID". Copy its value into the box on this page.</li>
    </ol> 
</Dialog>
{#if $spotifySignedIn && currentUser}
    <div class="form-item">
        Signed in to Spotify as 
        <Avatar imgUrl={currentUser.images[0]?.url} />
        { currentUser.display_name }
    </div>
    <Button on:click={authClear}>Sign out</Button> 
{:else}
    <div class="form-item mbe8">
        <Input 
            bind:value={$spotifyClientId} 
            label="Spotify Client ID"
            placeholder="0123456789abcdef0123456789abcdef"
            isInvalid={!validateSpotifyClientID($spotifyClientId)}
            invalidText="That does not look like a correct Spotify client ID."
            hasRightAddon
        >
        <Button slot="addonRight" on:click={dialog && dialog.show()}>Where do I get this?</Button>
        </Input>
    </div>
    
    <div class="form-item mbe8">
        <Button disabled={!validateSpotifyClientID($spotifyClientId)} on:click={initLogin} style="background: var(--spotify-green);">
            <iconify-icon icon="fa-brands:spotify" class="spotify-icon"/>
            Sign in to Spotify
        </Button>
    </div>
{/if}

<script lang="ts">
    import { Avatar, Input, Button, Dialog } from 'agnostic-svelte';
    import { getCurrentUser } from '../../spotify/player';
    import { spotifyClientId, spotifySignedIn } from '../../stores';
    import { initLogin, authClear } from '../../spotify/auth';

    let dialog: Dialog | null = null;

    let currentUser: SpotifyApi.CurrentUsersProfileResponse;
    $: (async s => s ? await getCurrentUser() : null)($spotifySignedIn).then(u => currentUser = u);

    function validateSpotifyClientID(s: string): boolean {
        return !!s.match(/^[a-z0-9]{32}$/);
    }

</script>

<style lang="less">

.spotify-icon {
    font-size: 2em;
    margin-right: 1rem;
}

</style>
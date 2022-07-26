<h2>Connect Twitch (Optional)</h2>
<p class="mbe16">
Connect Twitch below if you want a chatbot to respond to a command in chat that responds with information for the current playing song.
If you don't need this functionality, do not connect your account here.
</p>

{#if $twitchSignedIn && currentUser}
    <div class="form-item">
        Signed in to Twitch as 
        <Avatar imgUrl={currentUser.profile_image_url} />
        { currentUser.display_name }
    </div>
    <Button css="mbe8" on:click={authClear}>Sign out</Button>
    <div class="form-item mbe8">
        <Input label="Listen for commands in channel" bind:value={$twitchListenChannel}/>
    </div>
    <div class="form-item mbe8">
        <Input label="Command to listen for" bind:value={$twitchCommand} hasLeftAddon>
            <InputAddonItem addonLeft slot="addonLeft"><iconify-icon icon="emojione-monotone:exclamation-mark"/></InputAddonItem>
        </Input>
    </div>
{:else}
    <div class="form-item mbe8">
        <Button css="mbe8" on:click={initLogin} style="background: var(--twitch-purple);">
            <iconify-icon icon="fa-brands:twitch" class="twitch-icon"/>
            Sign in to Twitch
        </Button>
        <p>
        Bot messages will be sent from the Twitch account you sign in to. If you'd like to use a dedicated bot account, sign in to that 
        instead of your streaming account.
        </p>
    </div>
{/if}

<script lang="ts">
    import { twitchCommand, twitchListenChannel, twitchSignedIn } from '../../stores'
    import { TwitchUser, getTwitchUser } from '../../twitch/api'
    import { Avatar, Button, Input, InputAddonItem } from 'agnostic-svelte';
    import { initLogin, authClear } from '../../twitch/auth';

    let currentUser: TwitchUser;
    $: (async s => s ? await getTwitchUser() : null)($twitchSignedIn).then(u => {
        currentUser = u;
        $twitchListenChannel = u?.login || null;
        $twitchCommand = $twitchCommand || 'song';
    });
</script>

<style lang="less">    
    .twitch-icon {
        font-size: 2em;
        margin-right: 1rem;
    }
</style>
<div class="container">
    {#if !navigator.userAgent.match(/\bOBS\b/)}
    <div class="info-box">
        It looks like you are not visiting this page in OBS.  This tool <em>will not</em> work if you sign in with a
        desktop browser and then add this source to OBS.
    </div>
    {/if}

    <div class="login-form">
        <label>Spotify Client ID: 
            <input bind:value={$spotifyClientId} placeholder="0123456789abcdef0123456789abcdef"/>
        </label>
        <div class="login-button" on:click={login}>Sign In with Spotify</div>
    </div>

    {#if error}
    <div class="info-box">
        Failed to sign in to Spotify: {error}.
    </div>
    {/if}
</div>

<script lang="ts">
import {onMount} from 'svelte';
import {handleAuth, initLogin} from '../spotifyApi/auth'
import {spotifyClientId} from '../stores'

export let error: string | null = null;

onMount(async () => {
    try {
        await handleAuth()
    } catch (err) {
        error = err
    }
})

function login() {
    initLogin().catch(e => error = e)
}

</script>

<style lang="less">
.container {
    border-radius: var(--background-radius);
    background-color: var(--background-color);
    color: var(--text-color);
    padding: var(--main-margin);
}

.info-box {
    border: var(--text-color) 1px solid;
    background: #000000aa;
    margin: var(--main-margin);
    padding: var(--main-margin);
}

.login-form {
    margin: 4px auto;
    border-radius: 4px;
    font-weight: 600;
    width: 80%;

    label {
        display: inline-block;
        padding: 1em 0;
        width: 100%;
        input {
            height: 2em;
            width: 50%;
        }
    }
    
    
    .login-button {
        box-shadow: var(--background-color) 4px 4px 4px;
        background: var(--spotify-green);
        padding: 1em;
        text-align: center;
        cursor: pointer;
    }
}
</style>
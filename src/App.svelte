{#if route == '#spotify'}
	<SpotifyLoginCallback/>
{:else if route == '#twitch'}
	<TwitchLoginCallback/>
{:else if route == '#widget'}
	<NowPlaying/>
{:else}
	<Config/>
{/if}

<script lang="ts">
import NowPlaying from './components/Player/index.svelte';
import Config from './components/Config/index.svelte';
import SpotifyLoginCallback from './components/SpotifyLoginCallback.svelte';
import TwitchLoginCallback from './components/TwitchLoginCallback.svelte';
import 'agnostic-svelte/css/common.min.css';
import { loadStateFromQuery } from './stores';
import { onMount } from 'svelte';
import 'iconify-icon';

onMount(() => {
	loadStateFromQuery();
})

$: route = window.location.hash.match(/^#(\w+)/)?.[0] || '';
</script>

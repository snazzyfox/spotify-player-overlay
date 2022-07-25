{#if $signedIn}
	<NowPlaying/>
{:else}
	<Login />
{/if}

<script lang="ts">
	import Login from "./components/Login.svelte";
	import NowPlaying from "./components/NowPlaying.svelte";
	import { signedIn } from "./stores";
	import { refreshToken } from './spotifyApi/auth';
	import { onMount } from 'svelte';

	onMount(async () => {
		if ($signedIn) {
			await refreshToken();  // force refresh token on load; it's most likely expired
		}
	})
</script>

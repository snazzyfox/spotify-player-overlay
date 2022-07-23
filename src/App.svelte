<script lang="ts">
	import Login from "./components/Login.svelte";
	import NowPlaying from "./components/NowPlaying.svelte";
	import { signedIn } from "./stores";
</script>

{#if $signedIn}
	<NowPlaying/>
{:else}
	<Login />
{/if}

<style lang="less">

</style>
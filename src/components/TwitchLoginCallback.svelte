<script lang="ts">
    import { onMount } from 'svelte';
    import { authCallback } from '../twitch/auth'
    onMount(async () => {
        await authCallback();
        window.close();
    });
</script>
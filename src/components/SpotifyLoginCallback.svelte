<script lang="ts">
    import { onMount } from 'svelte';
    import { authCallback } from '../spotify/auth'
    onMount(async () => {
        await authCallback();
        window.close();
    });
</script>
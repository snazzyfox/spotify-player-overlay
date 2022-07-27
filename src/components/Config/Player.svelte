<h2>Widget Settings</h2>
<div class="form-item mbe8">
    <Input label="Auto-hide player after seconds" bind:value={$autoHideTime} type="number" placeholder="Always Visible"/>
    Automatically hide the player after this many seconds. Leave this box blank if the player should be
    displayed continuously when music is playing.
</div>

<script lang="ts">
    import { autoHideTime } from '../../stores';
    import { Input } from 'agnostic-svelte';
</script>
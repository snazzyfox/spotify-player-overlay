<h2>Widget Settings</h2>
<div class="form-item mbe8">
    <Input label="Auto-hide player after (seconds)" bind:value={$autoHideTime} type="number" min=1 placeholder="Always Visible"/>
    Automatically hide the player after this many seconds passes. The player will reappear automatically when a new track starts playing, 
    or when someone invokes it using the "show player command" (if Twitch integration is enabled). If you want the player to be on screen
    at all times, leave this box blank.
</div>

<script lang="ts">
import { autoHideTime } from '../../stores';
import { Input } from 'agnostic-svelte';
</script>
<div class="marquee-mask">
    <div class="marquee-text" bind:this={textElement} style="left: calc(var(--text-fade-width) + {position}px);">
        <slot/>
    </div>
</div>

<script lang="ts" context="module">
// static variable across all instances
const runningMarquees = new Set<string>();
</script>

<script lang="ts">
import { onMount, onDestroy } from 'svelte';
export let name: string;

const SPEED = 1.5;  // px per second
let textElement: HTMLDivElement;
let position = 0;
let isInCounter = false;

onMount(() => {
    setTimeout(animate, 2000);
})

onDestroy(() => {
    runningMarquees.delete(name);
})

function animate() {
    if (!textElement || !textElement.parentElement) { 
        requestAnimationFrame(animate);  // do nothing but still request a frame in case it comes back
    } else if (textElement.offsetWidth < textElement.parentElement.offsetWidth) {
        // fits on screen, no animation
        runningMarquees.delete(name);
        position = 0;
        requestAnimationFrame(animate);
    } else if (textElement.offsetLeft + textElement.offsetWidth < 0) {
        // fully off screen to the left
        runningMarquees.delete(name);
        if (runningMarquees.size === 0) {
            position = textElement.parentElement.offsetWidth;
        }
        requestAnimationFrame(animate);
    } else if (Math.abs(position) < SPEED) {
        // pause for a few secs when at left end
        position = 0;
        setTimeout(() => {
            runningMarquees.add(name);
            position -= SPEED; 
            requestAnimationFrame(animate);
        }, 2000);
    } else {
        position -= SPEED;
        requestAnimationFrame(animate);
    }
}
</script>

<style lang="less">
.marquee-mask {
    position: relative;
    mask-image: linear-gradient(to right, transparent 0, black var(--text-fade-width), black calc(100% - var(--text-fade-width)), transparent 100%);
    -webkit-mask-image: $mask-image;
    white-space: nowrap;
    overflow: hidden;
}
.marquee-text {
    position: relative;
    width: fit-content;
}
</style>
<div class="marquee-mask">
    <div class="marquee-text" bind:this={textElement} style="left: calc(var(--text-fade-width) + {position}%);">
        <slot/>
    </div>
</div>

<script lang="ts">
    import {onMount} from 'svelte';
    import {marqueeAnimateCounter} from '../stores'
    const SPEED = 0.25;
    let textElement: HTMLDivElement;
    let position = 0; // must match the left gradient level in CSS
    let isInCounter = false;

    onMount(() => {
        setTimeout(animate, 2000);
    })
    
    function animate() {
        if (!textElement) { return; }
        if (textElement.offsetWidth < textElement.parentElement.offsetWidth) {
            // fits on screen, no animation
            if (isInCounter) {
                $marqueeAnimateCounter -= 1;
                isInCounter = false;
            }
            position = 0;
            requestAnimationFrame(animate);
        } else if (textElement.offsetLeft + textElement.offsetWidth < 0) {
            // off screen to the left
            if (isInCounter) {
                $marqueeAnimateCounter -= 1;
                isInCounter = false;
            }
            if ($marqueeAnimateCounter === 0) {
                position = 100;
            }
            requestAnimationFrame(animate);
        } else if (Math.abs(position) < 0.001) {
            // pause for a few secs when at left end
            setTimeout(() => {
                $marqueeAnimateCounter += 1;
                isInCounter = true;
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
        white-space: nowrap;
    }
    .marquee-text {
        position: relative;
        width: fit-content;
    }
</style>
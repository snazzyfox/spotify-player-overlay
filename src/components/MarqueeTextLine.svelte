<div class="marquee-mask">
    <div class="marquee-text" bind:this={textElement} style="left: calc(var(--text-fade-width) + {position}%);">
        <slot/>
    </div>
</div>

<script lang="ts" context="module">
    // static variable across all instances
    let marqueeAnimateCounter = 0;
</script>

<script lang="ts">
    import {onMount} from 'svelte';
    const SPEED = 0.25;
    let textElement: HTMLDivElement;
    let position = 0; // must match the left gradient level in CSS
    let isInCounter = false;

    onMount(() => {
        setTimeout(animate, 2000);
    })
    
    function animate() {
        if (!textElement || !textElement.parentElement) { 
            requestAnimationFrame(animate);  // do nothing but still request a frame in case it comes back
        } else if (textElement.offsetWidth < textElement.parentElement.offsetWidth) {
            // fits on screen, no animation
            if (isInCounter) {
                marqueeAnimateCounter -= 1;
                isInCounter = false;
            }
            position = 0;
            requestAnimationFrame(animate);
        } else if (textElement.offsetLeft + textElement.offsetWidth < 0) {
            // off screen to the left
            if (isInCounter) {
                marqueeAnimateCounter--;
                isInCounter = false;
            }
            if (marqueeAnimateCounter <= 0) {
                position = 100;
            }
            requestAnimationFrame(animate);
        } else if (Math.abs(position) < SPEED) {
            // pause for a few secs when at left end
            position = 0;
            setTimeout(() => {
                if (!isInCounter) {
                    marqueeAnimateCounter++;
                    isInCounter = true;
                }
                position -= SPEED * 2; // first frame is double speed to avoid FP issues
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
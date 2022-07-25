
{#if nowPlaying}
<main transition:fade="{{ duration: 500 }}">
    {#key nowPlaying.trackName}
    <div class="nowplaying-container" in:slideIn="{{ pixels: 150, duration: 400 }}" out:slideOut="{{ pixels: 200, duration: 300 }}">
        <img class="album-art" src={nowPlaying.albumArtUrl} alt="Album Art" />
        <div class="text-container">
            <div class="track-name"><MarqueeTextLine>{ nowPlaying.trackName }</MarqueeTextLine></div>
            <div class="album-name"><MarqueeTextLine>{ nowPlaying.albumName }</MarqueeTextLine></div>
            <div class="artist-name"><MarqueeTextLine>{ nowPlaying.artistNames.join(", ") }</MarqueeTextLine></div>
            <div class="progress-bar-container">
                <div class="time elapsed">{ formatTime(computedProgressMs) }</div>
                <div class="progress-bar">
                    <div class="progress-bar-elapsed" style="width: {computedProgressMs / nowPlaying.trackLengthMs * 100}%;"/>
                </div>
                <div class="time total">{ formatTime(nowPlaying.trackLengthMs) }</div>
            </div>
        </div>
    </div>
    {/key}
    <img class="spotify-logo" src="./assets/spotify_logo.svg" alt="Spotify Logo"/>
</main>
{/if}
<!-- Nothing shows if nothing is playing -->

<script lang="ts">
import { onMount } from 'svelte';
import { getNowPlaying, NowPlaying } from '../spotifyApi/player';
import { fade } from 'svelte/transition';
import { slideOut, slideIn } from '../replaceSlideAnimation';
import MarqueeTextLine from './MarqueeTextLine.svelte';

export let nowPlaying: NowPlaying | null = null;
export let computedProgressMs: number = 0;
const MAX_POLL_INTERVAL = 5000;
const PROGRESS_UPDATE_INTERVAL = 500;

onMount(async () => {
    await updateNowPlaying()
    setInterval(() => {
        computedProgressMs = Math.min(computedProgressMs + PROGRESS_UPDATE_INTERVAL, nowPlaying?.trackLengthMs || 0);
    }, PROGRESS_UPDATE_INTERVAL);
})

async function updateNowPlaying() {
    nowPlaying = await getNowPlaying();
    let nextUpdateIn: number;
    if (nowPlaying) {
        nextUpdateIn = Math.min(MAX_POLL_INTERVAL, (nowPlaying.trackLengthMs - nowPlaying.progressMs + 2000) || MAX_POLL_INTERVAL);
        if (Math.abs(computedProgressMs - nowPlaying.progressMs) > 1000) {
            computedProgressMs = nowPlaying.progressMs;
        }
    } else {
        computedProgressMs = 0;
        nextUpdateIn = MAX_POLL_INTERVAL;
    }

    // refresh playback status 1 sec after the current track ends, or in 10 secs, whichever is shorter
    setTimeout(updateNowPlaying, nextUpdateIn);
}

export function formatTime(millis: number): string {
    let result = '';
    const hours = Math.floor(millis / 3600000);
    if (hours > 0) { result += hours.toString() + ':' }
    let minutes = Math.floor((millis % 3600000) / 60000).toString();
    if (hours > 0) { minutes = minutes.padStart(2, '0') }
    result += minutes + ':';
    const seconds = Math.floor((millis % 60000) / 1000);
    result += seconds.toString().padStart(2, '0');
    return result;
}
</script>

<style lang="less">
main {
	box-sizing: border-box;
    position: relative;
    background: var(--background-color);
	box-shadow: var(--background-shadow) 0 0 calc(var(--main-margin) / 2);
	border-radius: var(--background-radius);
	height: calc(100vh - 2 * var(--main-margin));
	width: calc(100vw - 2 * var(--main-margin));
}

.nowplaying-container {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 6vmin;

    padding: 7vmin;
    height: 100%;
    width: 100%;
}

.spotify-logo {
    position: absolute;
    top: 3vmin;
    right: 3vmin;
    height: 10vmin;
}

.album-art {
    flex: 0 0 auto;
    box-shadow: var(--background-shadow) 0 0 10%;
    height: 100%;
}

.text-container {
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 60vmin;
    max-width: calc(100% - 85vmin);
    flex: 1 0 auto;

    .track-name {
        font-size: 13vmin;
        font-weight: 600;
        margin-bottom: 8vmin;
    }
    .album-name, .artist-name {
        font-size: 8vmin;
    }
}

.progress-bar-container {
    align-items: center;
    display: flex;
    margin-left: var(--text-fade-width);
}

.time {
    color: var(--time-color);
    font-family: 'Overpass Mono', monospace;
    font-size: 7vmin;

    &.total {
        text-align: right;
    }
}

.progress-bar {
    background: #ffffff66;
    border-radius: 1.2vmin;
    flex: 1;
    height: 2.5vmin;
    margin: 0 5vmin;
    width: 95%;

    .progress-bar-elapsed {
        background: #ffffff;
        border-radius: 1.2vmin;
        height: 100%;
        max-width: 100%;
    }
}
</style>
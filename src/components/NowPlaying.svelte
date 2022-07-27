
{#if nowPlaying && playerVisible}
<main transition:fade="{{ duration: 500 }}">
    {#key nowPlaying && nowPlaying.trackName}
    <div class="nowplaying-container" in:slideIn="{{ pixels: 150, duration: 400 }}" out:slideOut="{{ pixels: 200, duration: 300 }}">
        <img class="album-art" src={nowPlaying && nowPlaying.albumArtUrl} alt="Album Art" />
        <div class="text-container">
            <div class="track-name"><MarqueeTextLine>{ nowPlaying && nowPlaying.trackName }</MarqueeTextLine></div>
            <div class="album-name"><MarqueeTextLine>{ nowPlaying && nowPlaying.albumName }</MarqueeTextLine></div>
            <div class="artist-name"><MarqueeTextLine>{ nowPlaying && nowPlaying.artistNames.join(", ") }</MarqueeTextLine></div>
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
    <iconify-icon icon="fa-brands:spotify" class="spotify-logo"/>
</main>
{/if}
<!-- Nothing shows if nothing is playing -->

<script lang="ts">
import { onMount } from 'svelte';
import { getNowPlaying, NowPlaying } from '../spotify/player';
import { fade } from 'svelte/transition';
import { slideOut, slideIn } from '../replaceSlideAnimation';
import MarqueeTextLine from './MarqueeTextLine.svelte';
import { refreshToken } from '../spotify/auth';
import { twitchAuthToken, twitchInfoCommand, twitchListenChannel, twitchShowCommand, autoHideTime } from '../stores';
import { getTwitchUser } from '../twitch/api';
import ComfyJS from 'comfy.js';

export let nowPlaying: NowPlaying | null = null;
export let computedProgressMs: number = 0;
export let playerVisible: boolean = true;
const MAX_POLL_INTERVAL = 5000;
const PROGRESS_UPDATE_INTERVAL = 500;

onMount(async () => {
    await refreshToken();
    await updateNowPlaying();
    setInterval(() => {
        computedProgressMs = Math.min(computedProgressMs + PROGRESS_UPDATE_INTERVAL, nowPlaying?.trackLengthMs || 0);
    }, PROGRESS_UPDATE_INTERVAL);
    startTwitchBot();
})

async function updateNowPlaying() {
    const lastSong = nowPlaying;
    nowPlaying = await getNowPlaying();
    if (lastSong?.trackName !== nowPlaying?.trackName) {
        showPlayer();
    }
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

function formatTime(millis: number): string {
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

let timeoutId: number = 0;
function showPlayer() {
    if (nowPlaying) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        playerVisible = true;
        if (Number($autoHideTime)) {
            timeoutId = setTimeout(() => playerVisible = false, Number($autoHideTime) * 1000);
        }
    }
}

async function startTwitchBot() {
    if ($twitchAuthToken) {
        const twitchUser = await getTwitchUser();
        ComfyJS.onCommand = (user, command) => {
            if (command === $twitchInfoCommand) {
                if (nowPlaying) {
                    ComfyJS.Say(`@${user} -> now playing ${nowPlaying.trackName} by ${nowPlaying.artistNames.join(',')} on Spotify: ${nowPlaying.trackUrl}`, twitchUser.login);
                } else {
                    ComfyJS.Say(`@${user} -> nothing is playing on Spotify at the moment.`, twitchUser.login);
                }
            }
            if (command === $twitchShowCommand) {
                showPlayer();
            }
        }
        ComfyJS.Init(twitchUser.login, 'oauth:' + $twitchAuthToken, $twitchListenChannel || twitchUser.login);
    }
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
    margin: var(--main-margin);
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
    font-size: 10vmin;
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
    font-family: var(--font-family-mono);
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
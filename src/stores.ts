import { writable, derived, Writable } from "svelte/store";
import LZString from 'lz-string';

const knownStoreVars: string[] = [];

function storedWritable<T>(key: string) {
    const storeVar = writable<T>(JSON.parse(localStorage.getItem(key)));
    // forward sync from app state to local storage
    storeVar.subscribe((newValue) => {
        if (newValue !== null) {
            localStorage.setItem(key, JSON.stringify(newValue));
        } else {
            localStorage.removeItem(key);
        }
    })

    // backward sync from local storage to app (in case it's changed in another tab)
    window.addEventListener('storage', (event: StorageEvent) => {
        if (event.key === null) {
            storeVar.set(null);
        } else if (event.key === key && event.oldValue !== event.newValue) {
            storeVar.set(JSON.parse(event.newValue));
        }
    })
    knownStoreVars.push(key);
    return storeVar;
}

export const spotifyClientId = storedWritable<string>('SPOTIFY_CLIENT_ID');
export const spotifyAuthToken = storedWritable<string>('SPOTIFY_TOKEN');
export const spotifyAuthState = storedWritable<string>('SPOTIFY_AUTH_STATE');
export const spotifyAuthCode = storedWritable<string>('SPOTIFY_AUTH_CODE');
export const spotifyAuthVerifier = storedWritable<string>('SPOTIFY_CODE_VERIFIER');
export const spotifyTokenExpires = storedWritable<number>('SPOTIFY_AUTH_TOKEN_EXPIRES');
export const spotifyRefreshToken = storedWritable<string>('SPOTIFY_REFRESH_TOKEN');
export const twitchAuthToken = storedWritable<string>('TWITCH_AUTH_TOKEN');
export const twitchAuthState = storedWritable<string>('TWITCH_AUTH_STATE');
export const twitchListenChannel = storedWritable<string>('TWITCH_LISTEN_CHANNEL');
export const twitchCommand = storedWritable<string>('TWITCH_COMMAND');

export const spotifySignedIn = derived(spotifyAuthToken, $spotifyAuthToken => $spotifyAuthToken !== null);
export const twitchSignedIn = derived(twitchAuthToken, $twitchAuthToken => $twitchAuthToken !== null);

export function dumpState() {
    const data: Array<{key: string, value: string}> = []
    for (const key of knownStoreVars) {
        data.push({key, value: localStorage.getItem(key)});
    }
    return 'cf=' + LZString.compressToEncodedURIComponent(JSON.stringify(data));
}

export function loadStateFromQuery() {
    const qs = new URLSearchParams(location.search);
    const conf = qs.get('cf');
    if (conf) {
        const data: Array<{key: string, value: string}> = JSON.parse(LZString.decompressFromEncodedURIComponent(conf));
        for (const row of data) {
            localStorage.setItem(row.key, row.value);
        }
        window.location.search = null; // this auto reloads the page so state is correctly read back
    }
}
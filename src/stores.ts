import { writable, derived } from "svelte/store";

function storedWritable<T>(key: string) {
    const storeVar = writable<T>(JSON.parse(localStorage.getItem(key)));
    storeVar.subscribe((newValue) => {
        if (newValue !== null) {
            localStorage.setItem(key, JSON.stringify(newValue));
        } else {
            localStorage.removeItem(key);
        }
    })
    return storeVar;
}

export const spotifyAuthToken = storedWritable<string>('SPOTIFY_TOKEN');
export const spotifyAuthState = storedWritable<string>('SPOTIFY_AUTH_STATE');
export const spotifyAuthCode = storedWritable<string>('SPOTIFY_AUTH_CODE');
export const spotifyAuthVerifier = storedWritable<string>('SPOTIFY_CODE_VERIFIER');
export const spotifyTokenExpires = storedWritable<number>('SPOTIFY_AUTH_TOKEN_EXPIRES');
export const spotifyRefreshToken = storedWritable<string>('SPOTIFY_REFRESH_TOKEN');
export const signedIn = derived(spotifyAuthToken, $spotifyAuthToken => $spotifyAuthToken !== null);
export const marqueeAnimateCounter = writable<number>(0);
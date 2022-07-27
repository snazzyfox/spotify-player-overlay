import axios from 'axios';
import { get } from 'svelte/store';
import { 
    spotifyAuthState, 
    spotifyAuthToken, 
    spotifyAuthCode, 
    spotifyAuthVerifier, 
    spotifyRefreshToken,
    spotifyClientId,
} from '../stores';
const REDIRECT_URI = location.origin + location.pathname + '#spotify'; // strip off hash & querystring etc

export async function initLogin() {
    if (!get(spotifyClientId)) {
        throw 'No client ID was provided.'
    }
    const verifier = cryptoRandomString(72);
    const codeChallenge = await hashCodeChallenge(verifier);
    const state = (Math.random() * 1e24).toString(36);
    spotifyAuthToken.set(null);
    spotifyAuthCode.set(null);
    spotifyAuthState.set(state);
    spotifyAuthVerifier.set(verifier);
    const loginUrl = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
        response_type: 'code',
        client_id: get(spotifyClientId),
        scope: 'user-read-playback-position user-read-playback-state user-read-currently-playing',
        redirect_uri: REDIRECT_URI,
        state: state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        show_dialog: 'false',
    }).toString();
    window.open(loginUrl, '_blank', 'popup,innerWidth=600,innerHeight=800');
}

async function getToken(params: {[key: string]: string}) {
    const formData = new URLSearchParams(params)
    const response = await axios.post('https://accounts.spotify.com/api/token', formData);
    spotifyAuthToken.set(response.data.access_token);
    if (response.data.refresh_token) {
        spotifyRefreshToken.set(response.data.refresh_token);
    }
}

export async function refreshToken() {
    const token = get(spotifyRefreshToken);
    if (token) {
        try {
            await getToken({
                grant_type: 'refresh_token',
                refresh_token: get(spotifyRefreshToken),
                client_id: get(spotifyClientId),
            })
        } catch (e) {
            // something's wrong with the refresh token, try auth code instead
            console.error(e);
            await requestToken();
        }
    }
}

export async function requestToken() {
    await getToken({
        grant_type: 'authorization_code',
        code: get(spotifyAuthCode),
        redirect_uri: REDIRECT_URI,
        client_id: get(spotifyClientId),
        code_verifier: get(spotifyAuthVerifier),
    })
    /* There's no try-catch here - if this fails in the on-stream player, we can't just prompt another login */
}

export async function authCallback() {
    const qs = new URLSearchParams(location.search);
    history.replaceState(null, '', location.pathname); // wipe off auth code from url
    if (qs.get('state') && qs.get('state') === get(spotifyAuthState)) {
        // always remove state from storage - it's single use
        spotifyAuthState.set(null);
        if (qs.has('code')) {
            spotifyAuthCode.set(qs.get('code'));
            await requestToken();
        } else {
            authClear();
            if (qs.has('error')) {
                throw qs.get('error');
            } else {
                throw 'unknown error'
            }
        }
    }
    // not coming back from spotify, dont do anything
}

export function authClear() {
    spotifyAuthCode.set(null);
    spotifyAuthToken.set(null);
    spotifyAuthVerifier.set(null);
    spotifyRefreshToken.set(null);
}

function cryptoRandomString(length: number): string {
    const array = new Uint8Array((length || 40) / 2)
    crypto.getRandomValues(array)
    return Array.from(array, (decimal) => decimal.toString(16)).join('')
}

async function hashCodeChallenge(message: string): Promise<string> {
    const bytes = new TextEncoder().encode(message);
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return btoa(String.fromCharCode.apply(null, new Uint8Array(hash))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

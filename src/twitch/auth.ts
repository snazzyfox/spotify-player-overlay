import { get } from 'svelte/store';
import { twitchAuthState, twitchAuthToken } from '../stores'
const REDIRECT_URI = location.origin + location.pathname + '#twitch';
export const CLIENT_ID = '8qfupphh47by5drg44h6vq9teo506g';

export async function initLogin() {
    const state = (Math.random() * 1e24).toString(36);
    twitchAuthToken.set(null);
    twitchAuthState.set(state);
    const loginUrl = 'https://id.twitch.tv/oauth2/authorize?' + new URLSearchParams({
        response_type: 'token',
        client_id: CLIENT_ID,
        scope: 'chat:edit chat:read',
        redirect_uri: REDIRECT_URI,
        state: state,
        force_verify: 'false',
    }).toString();
    window.open(loginUrl, '_blank', 'popup,innerWidth=600,innerHeight=800');
}

export async function authCallback() {
    const qs = new URLSearchParams(location.hash.substring(location.hash.indexOf('#', 1) + 1));  // twitch passes it in hash not query
    history.replaceState(null, '', location.pathname); // wipe off auth code from url
    if (qs.get('state') && qs.get('state') === get(twitchAuthState)) {
        // always remove state from storage - it's single use
        twitchAuthState.set(null);
        if (qs.has('access_token')) {
            twitchAuthToken.set(qs.get('access_token'));
        } else {
            authClear();
            if (qs.has('error')) {
                throw qs.get('error_description');
            } else {
                throw 'unknown error'
            }
        }
    }
}

export function authClear() {
    twitchAuthToken.set(null);
}

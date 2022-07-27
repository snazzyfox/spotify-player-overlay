import SpotifyWebApi from 'spotify-web-api-js';
import { spotifyAuthToken } from '../stores';

let tokenSet: boolean = false;
const spotify = new SpotifyWebApi();
spotifyAuthToken.subscribe((token: string) => { spotify.setAccessToken(token); tokenSet = true});

export interface NowPlaying {
    albumName: string
    albumArtUrl: string | null
    artistNames: string[]
    trackName: string
    trackLengthMs: number 
    progressMs: number
    trackUrl: string
}

export async function getNowPlaying(): Promise<NowPlaying | null> {
    if (!tokenSet) {
        return null;
    }
    const playbackState = await spotify.getMyCurrentPlaybackState();
    if (!playbackState.is_playing || !playbackState.item) {
        return null;
    }
    return {
        albumName: playbackState.item.album.name,
        albumArtUrl: playbackState.item.album.images[0].url || null,
        artistNames: playbackState.item.artists.map(a => a.name),
        trackName: playbackState.item.name,
        trackLengthMs: playbackState.item.duration_ms,
        progressMs: playbackState.progress_ms,
        trackUrl: playbackState.item.external_urls.spotify,
    };
}

export async function getCurrentUser() {
    if (tokenSet) {
        return await spotify.getMe();
    } else {
        return null;
    }
}
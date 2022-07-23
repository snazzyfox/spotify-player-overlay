import SpotifyWebApi from 'spotify-web-api-js';
import { spotifyAuthToken, spotifyTokenExpires } from '../stores';
import { refreshToken } from './auth'

const spotify = new SpotifyWebApi();
spotifyAuthToken.subscribe((token: string) => spotify.setAccessToken(token));
spotifyTokenExpires.subscribe((expires: number) => {
    if (expires) {
        const now = new Date().getTime();
        if (expires <= now) { refreshToken(); }
        else { setTimeout(refreshToken, expires - now); }
    }
})

export interface NowPlaying {
    albumName: string
    albumArtUrl: string | null
    artistNames: string[]
    trackName: string
    trackLengthMs: number 
    progressMs: number
}

export async function getNowPlaying(): Promise<NowPlaying | null> {
    const playbackState = await spotify.getMyCurrentPlaybackState();
    if (!playbackState.is_playing || !playbackState.item) {
        return null
    }
    return {
        albumName: playbackState.item.album.name,
        albumArtUrl: playbackState.item.album.images[0].url || null,
        artistNames: playbackState.item.artists.map(a => a.name),
        trackName: playbackState.item.name,
        trackLengthMs: playbackState.item.duration_ms,
        progressMs: playbackState.progress_ms,
    }
}
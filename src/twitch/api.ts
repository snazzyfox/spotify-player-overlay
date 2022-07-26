import axios from 'axios';
import { CLIENT_ID } from './auth'
import { twitchAuthToken } from '../stores';

export const twitchApi = axios.create({
    baseURL: 'https://api.twitch.tv/helix',
    headers: { 'Client-Id': CLIENT_ID }
});
   
twitchAuthToken.subscribe(token => twitchApi.defaults.headers['Authorization'] = 'Bearer ' + token);

export interface TwitchUser {
    id: string
    login: string
    display_name: string
    profile_image_url: string
}

interface TwitchResponse<T> {
    data: T[]
}

export async function getTwitchUser(login?: string): Promise<TwitchUser | null> {
    const response = await twitchApi.get<TwitchResponse<TwitchUser>>('/users', {params: {login}});
    return response.data.data[0] || null;
}
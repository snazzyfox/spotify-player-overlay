# Spotify Player Overlay

A simple, client side only "now playing" card that you can use to display what you're playing in Spotify in OBS.

## How to use

This tool is intended to be used inside of your streaming tool such as OBS. To add it to your stream:

1. Create a new Browser source, and enter the URL: https://snazzyfox.github.io/spotify-player-overlay/
2. Save the source. You should now see a window with a "Sign in to Spotify" button.
3. Go to Interact for the browser source (by right clicking on it). Log into Spotify in this browser and approve app access.
4. Edit the Browser source to your desired size. Width 800 and height 240 is a good starting point.

## Development

To run a local app in development mode:

    npm install
    npm run dev

You will need a Spotify Client ID to develop this. Get one at the [Spotify Developer Console](https://developer.spotify.com/console/).

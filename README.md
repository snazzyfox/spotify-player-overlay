# Spotify Player Overlay

A simple, client side only "now playing" card that you can use to display what you're playing in Spotify in OBS. The overlay automatically disappears when your music is paused or stopped.

## How to use

This tool is intended to be used inside of your streaming tool such as OBS. To add it to your stream:

### Create a new Spotify Developer Account 
This application has not yet been reviewed by Spotify and therefore cannot be used by anyone. You will need a Spotify developer account in order to test it.

1. Go to the [Spotify Developer Console](https://developer.spotify.com/console/) and log in with your Spotify account. 
2. Go to "Dashboard", then "Create An App"
3. Enter a name and description (anything goes), then click create.
4. You will be taken to the App's page. Find the "Client ID" on this page. You will need it in the next step.

### Adding the player to your stream

1. In OBS, create a new Browser source.
2. Enter the URL: `https://snazzyfox.github.io/spotify-player-overlay/`. Set the width and height both to 1000 for now. (Otherwise, the window would not be big enough for you to sign in to Spotify)
3. Save the source. Your source should now have a "Sign in to Spotify" button.
4. Right click on the browser source and select "Interact"
5. In the pop up window, log into Spotify and approve app access.
6. Edit the Browser source again and change the source to your desired size. Width 600 and height 200 is a good starting point. 

For best quality, the aspect ratio at 3:1 or higher, and avoid scaling the source up/down in OBS. Instead, change the size inside the browser source to have the player update the layout itself.

### Customizing the player

Most themeing elements are in [CSS variables](/public/theme.css) declared in `:root`. If you'd like to change any of the colors and sizing options, you can override them in OBS.


## Development

To run a local app in development mode:

    npm install
    npm run dev

You will need a Spotify Client ID to develop this. Get one 

export async function getSpotifyClientToken() {
    try {
        const response = await fetch('/api/spotify-auth');
        if (!response.ok) throw new Error('Failed to fetch token');
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function fetchPlaylist(playlistId, accessToken) {
    try {
        const response = await fetch(`/api/playlist?playlistId=${playlistId}&accessToken=${accessToken}`);
        if (!response.ok) throw new Error('Failed to fetch playlist data');
        return await response.json();
    } catch (error) {
        console.error("Error fetching playlist:", error);
        return null;
    }
}


export async function fetchAccessToken(code) {
    try {
        const response = await fetch('/api/spotify-auth', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Failed to fetch access token:", error);
        return null;
    }
}

export function loginWithSpotify() {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
    const scopes = [
        "playlist-read-private",
        "playlist-read-collaborative"
    ];

    const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${clientId}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scopes.join(' '))}`;

    window.location.href = authUrl;
}

export async function fetchUserPlaylists(accessToken) {
    try {
        const response = await fetch("https://api.spotify.com/v1/me/playlists", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!response.ok) throw new Error("Failed to fetch user playlists");

        return await response.json();
    } catch (error) {
        console.error("Error fetching user playlists:", error);
        return null;
    }
}

export async function fetchPlaylist(playlistId, accessToken) {
    try {
        const response = await fetch(`http://localhost:5000/playlist?playlistId=${playlistId}&accessToken=${accessToken}`);
        if (!response.ok) throw new Error('Failed to fetch playlist');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

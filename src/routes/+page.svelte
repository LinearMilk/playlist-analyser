<script>
    import { fetchPlaylist } from '../lib/api.js';

    let playlistId = $state('your_playlist_id_here');
    let accessToken = $state('your_spotify_access_token_here');
    let playlistData = $state(null);

    $effect(() => {
        (async () => {
            if (playlistId && accessToken) {
                playlistData = await fetchPlaylist(playlistId, accessToken);
            }
        })();
    });
</script>

{#if playlistData}
    <h2>{playlistData.name}</h2>
    <ul>
        {#each playlistData.tracks.items as item}
            <li>{item.track.name} - {item.track.artists[0].name}</li>
        {/each}
    </ul>
{:else}
    <p>Loading...</p>
{/if}
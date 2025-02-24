<script>
  import { fetchPlaylist } from './lib/api.js';

  let playlistUrl = $state('');
  let accessToken = $state('your_spotify_access_token_here');
  let playlistData = $state(null);
  let isLoading = $state(false);
  let error = $state(null);

  function extractPlaylistId(url) {
      const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
      return match ? match[1] : null;
  }

  async function loadPlaylist() {
      try {
          error = null;
          isLoading = true;
          
          const playlistId = extractPlaylistId(playlistUrl);
          if (!playlistId) throw new Error("Invalid Spotify playlist URL");
          
          playlistData = await fetchPlaylist(playlistId, accessToken);
      } catch (err) {
          error = err.message;
          playlistData = null;
      } finally {
          isLoading = false;
      }
  }
</script>

<div class="container">
  <h1>Spotify Playlist Analyzer</h1>

  <div class="input-section">
      <input type="text" bind:value={playlistUrl} placeholder="Enter Spotify playlist URL" />
      <!-- Updated to onClick -->
      <button onClick={loadPlaylist}>Fetch Data</button>
  </div>

  {#if error}
      <p class="error">{error}</p>
  {:else if isLoading}
      <p>Loading playlist data...</p>
  {:else if playlistData}
      <div class="playlist-info">
          <h2>{playlistData.name}</h2>
          <p>By: {playlistData.owner.display_name}</p>
          <p>Total Tracks: {playlistData.tracks.total}</p>

          <ul>
              {#each playlistData.tracks.items as item}
                  <li>{item.track.name} - {item.track.artists[0].name}</li>
              {/each}
          </ul>
      </div>
  {:else}
      <p>Enter a playlist URL and click Fetch Data.</p>
  {/if}
</div>

<style>
  .container {
      max-width: 600px;
      margin: auto;
      text-align: center;
  }
  .input-section {
      margin: 20px 0;
  }
  input {
      padding: 10px;
      width: 60%;
      margin-right: 10px;
  }
  button {
      padding: 10px 15px;
      cursor: pointer;
  }
  .playlist-info {
      margin-top: 20px;
      text-align: left;
  }
  .error {
      color: red;
      font-weight: bold;
  }
</style>
<script>
  import { fetchPlaylist, loginWithSpotify, fetchAccessToken } from './lib/api.js';

  // State declarations
  let playlistUrl = $state('');
  let accessToken = $state(localStorage.getItem("spotify_access_token") || '');
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
          
          if (!accessToken) {
              throw new Error("Please log in with Spotify first.");
          }
          
          playlistData = await fetchPlaylist(playlistId, accessToken);
      } catch (err) {
          error = err.message;
          playlistData = null;
      } finally {
          isLoading = false;
      }
  }

  function logout() {
      localStorage.removeItem("spotify_access_token");
      accessToken = '';
  }

  $effect(async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code && !accessToken) {
          accessToken = await fetchAccessToken(code);
          if (accessToken) {
              localStorage.setItem("spotify_access_token", accessToken);
              window.history.replaceState({}, document.title, "/"); // Clean URL
          }
      }
  });
</script>

<div class="container">
  <h1>Spotify Playlist Analyzer</h1>

  {#if !accessToken}
      <!-- Use onclick temporarily to avoid TypeScript errors -->
      <button onclick={loginWithSpotify}>Login with Spotify</button>
  {:else}
      <button onclick={logout}>Logout</button>
  {/if}

  <div class="input-section">
      <input type="text" bind:value={playlistUrl} placeholder="Enter Spotify playlist URL" />
      <button onclick={loadPlaylist}>Fetch Data</button>
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
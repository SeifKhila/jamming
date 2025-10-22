// src/util/Spotify.js
const clientId =
  process.env.REACT_APP_SPOTIFY_CLIENT_ID || "1a021c50b619446aac665131dde9aab5";

// Must exactly match what’s in your Spotify Dashboard
const redirectUri = window.location.origin.includes("github.io")
  ? "https://seifkhila.github.io/jamming/"
  : "https://localhost:3001/";

console.log("[Spotify] redirectUri:", redirectUri);


// Minimum scopes Jammming needs (create playlists + add tracks)
const scopes = ["playlist-modify-public", "playlist-modify-private"];

let accessToken = "";
let tokenExpiresAt = 0;

const Spotify = {
  getAccessToken() {
    // 1) Reuse valid token if we already have one
    if (accessToken && Date.now() < tokenExpiresAt) {
      console.log("[Spotify] Using cached token");
      return accessToken;
    }

    // 2) If we just came back from Spotify, the token is in the URL hash
    const hash = window.location.hash; // e.g. "#access_token=...&token_type=Bearer&expires_in=3600"
    if (hash) {
      console.log("[Spotify] Found URL hash:", hash);
      const params = new URLSearchParams(hash.slice(1));
      const token = params.get("access_token");
      const expiresIn = Number(params.get("expires_in") || 0);

      if (token) {
        accessToken = token;
        tokenExpiresAt = Date.now() + expiresIn * 1000;

        // Clear token when it expires
        window.setTimeout(() => {
          accessToken = "";
          tokenExpiresAt = 0;
        }, expiresIn * 1000);

        // Clean the URL (remove the hash so it doesn't linger)
        window.history.replaceState({}, document.title, window.location.pathname);

        console.log("[Spotify] Token stored, expiresIn (s):", expiresIn);
        return accessToken;
      }
    }

    // 3) No token yet — redirect user to Spotify authorize page
    const authUrl =
      "https://accounts.spotify.com/authorize" +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&response_type=token` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scopes.join(" "))}`;

    console.log("[Spotify] Redirecting to:", authUrl);
    window.location = authUrl;
    return null; // IMPORTANT: stop further execution after redirect
  },
};

// Search Spotify for tracks and return simplified objects
Spotify.search = async function (term) {
  const q = (term || "").trim();
  if (!q) return [];

  const token = Spotify.getAccessToken(); // may redirect the first time
  if (!token) return [];                  // just redirected; user will click Search again

  const endpoint = `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(q)}`;

  try {
    const res = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Spotify search failed: ${res.status}`);

    const data = await res.json();
    const items = data?.tracks?.items || [];
    return items.map((t) => ({
      id: t.id,
      name: t.name,
      artist: t.artists?.[0]?.name ?? "Unknown",
      album: t.album?.name ?? "Unknown",
      uri: t.uri,
    }));
  } catch (err) {
    console.error("[Spotify.search] error:", err);
    return [];
  }
};

// Create a playlist and add tracks (uris) to the user's Spotify account
Spotify.savePlaylist = async function (name, uris) {
  const playlistName = (name || "").trim();
  if (!playlistName || !uris || uris.length === 0) {
    return null; // nothing to save
  }

  const token = Spotify.getAccessToken(); // may redirect if not logged in
  if (!token) return null;

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    // 1) Get current user id
    const meRes = await fetch("https://api.spotify.com/v1/me", { headers });
    if (!meRes.ok) throw new Error(`Get user failed: ${meRes.status}`);
    const me = await meRes.json();
    const userId = me.id;

    // 2) Create a new playlist
    const createRes = await fetch(
      `https://api.spotify.com/v1/users/${encodeURIComponent(userId)}/playlists`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: playlistName,
          public: true, // or false for private
          description: "Created with Jammming",
        }),
      }
    );
    if (!createRes.ok) throw new Error(`Create playlist failed: ${createRes.status}`);
    const playlist = await createRes.json();
    const playlistId = playlist.id;

    // 3) Add tracks by URI
    const addRes = await fetch(
      `https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/tracks`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ uris }),
      }
    );
    if (!addRes.ok) throw new Error(`Add tracks failed: ${addRes.status}`);

    return playlistId; // success
  } catch (err) {
    console.error("[Spotify.savePlaylist] error:", err);
    return null;
  }
};


export default Spotify;



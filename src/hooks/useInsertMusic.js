import { useAuth0 } from "@auth0/auth0-react";
import useInsertArtist from "./useInsertArtist";

function useInsertMusic() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const insertArtist = useInsertArtist();

  const insertAlbum = async (albumId) => {
    try {
      // 1. Fetch album info from your Spotify proxy
      const res = await fetch(`http://localhost:8484/getAlbumInfo?q=${albumId}`);
      if (!res.ok) {
        throw new Error(`Track fetch failed: ${res.status}`);
      }
      const albumInfo = await res.json();
      console.log("albumInfo:", albumInfo);

      // 2. Insert all artists (if multiple)
      if (albumInfo.artists.length > 1) {
        const insertions = albumInfo.artists.map((artist) =>
          insertArtist(artist.id).catch((err) => console.error(err))
        );
        await Promise.all(insertions);
      }

      // 3. Try to get access token, but continue if not authenticated
      let token;
      if (isAuthenticated) {
        try {
          token = await getAccessTokenSilently({
            audience: process.env.REACT_APP_AUTH0_API_IDENTIFIER,
          });
        } catch (err) {
          console.warn("Token retrieval failed:", err.message);
        }
      }

      // 4. Normalize release date
      let normalizedReleaseDate = albumInfo.release_date;
      if (/^\d{4}$/.test(normalizedReleaseDate)) {
        normalizedReleaseDate += "-01-01";
      } else if (/^\d{4}-\d{2}$/.test(normalizedReleaseDate)) {
        normalizedReleaseDate += "-01";
      }

      // 5. Prepare headers
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // 6. POST to Supabase backend
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/insertMusic`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            albumid: albumInfo.id,
            artistid: albumInfo.artists[0]?.id || null,
            title: albumInfo.name,
            spotifylink: albumInfo.external_urls.spotify,
            coverart: albumInfo.images[0]?.url || null,
            releasedate: normalizedReleaseDate,
            tracks: albumInfo.tracks,
            type: albumInfo.album_type,
          }),
        }
      );

      const data = await response.json();
      console.log("insertMusic response:", data);

      if (!response.ok) throw new Error(data.error || "Something went wrong");
      return data;
    } catch (err) {
      console.error("Insert failed:", err.message);
      throw err;
    }
  };

  return insertAlbum;
}

export default useInsertMusic;

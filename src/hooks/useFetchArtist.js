// useArtistFetcher.js
import { useAuth0 } from "@auth0/auth0-react";

function useArtistFetcher() {
  const fetchArtist = async (artistId) => {
    if (!artistId) throw new Error("artistId is required");

    console.log("fetchArtist: artistId", artistId);

    try {
    console.log("fetchArtist: artistId", artistId);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/artist/${artistId}`
      );

    console.log("res:", res);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch artist");

      console.log("fetchArtist success:", data);
      return data;
    } catch (err) {
      console.error("fetchArtist error:", err.message);
      throw err;
    }
  };

  return fetchArtist;
}

export default useArtistFetcher;

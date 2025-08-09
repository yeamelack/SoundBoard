import { useAuth0 } from "@auth0/auth0-react";

function useInsertArtist() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const insertArtist = async (artistId) => {
    try {
      let token;
      if (isAuthenticated) {
        try {
          token = await getAccessTokenSilently({
            audience: process.env.REACT_APP_AUTH0_API_IDENTIFIER,
          });
        } catch (err) {
          console.warn("Could not retrieve token silently:", err.message);
          // Proceed without token
        }
      }

      const spotifyUrl = `http://localhost:8484/artist?q=${artistId}`;
      let artistData;

      try {
        const response = await fetch(spotifyUrl);
        if (!response.ok) {
          throw new Error(`Spotify response status: ${response.status}`);
        }
        artistData = await response.json();
        console.log("response:", artistData);
      } catch (error) {
        console.error("Spotify fetch error:", error.message);
        throw new Error("Failed to fetch artist info from Spotify.");
      }

      // Build headers conditionally
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/insertArtist`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            artistid: artistData.id,
            artistName: artistData.name,
            profilepic: artistData.images[0]?.url || null,
          }),
        }
      );

      const data = await res.json();
      console.log("IA data", data);
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      return data;
    } catch (err) {
      console.error("Insert artist failed:", err.message);
      throw err;
    }
  };

  return insertArtist;
}

export default useInsertArtist;

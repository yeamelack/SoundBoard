import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

function useFetchMusic() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const fetchMusic = useCallback(
    async (musicId) => {
      if (!musicId) throw new Error("musicId is required");

      const headers = {
        "Content-Type": "application/json",
      };

      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently({
            audience: process.env.REACT_APP_AUTH0_API_IDENTIFIER,
          });
          headers.Authorization = `Bearer ${token}`;
        } catch (err) {
          console.warn("Could not retrieve token silently:", err.message);
          // Proceed unauthenticated
        }
      }

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/music/${musicId}`,
        {
          method: "GET",
          headers,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        const error = new Error(data.error || "Failed to fetch music");
        error.code = data.code;
        throw error;
      }

      return data;
    },
    [getAccessTokenSilently, isAuthenticated]
  );

  return fetchMusic;
}

export default useFetchMusic;

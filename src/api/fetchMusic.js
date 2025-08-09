import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

function useFetchMusic() {
  const { getAccessTokenSilently } = useAuth0();

  const fetchMusic = useCallback(async (musicId) => {
    const token = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUTH0_API_IDENTIFIER,
    });

    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/music/${musicId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.error || "Failed to fetch music");
      error.code = data.code;
      throw error;
    }

    return data;
  }, [getAccessTokenSilently]);

  return fetchMusic;
}

export default useFetchMusic;

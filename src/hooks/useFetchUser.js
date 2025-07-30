// useArtistFetcher.js
import { useAuth0 } from "@auth0/auth0-react";

function useFetchUser() {
  const { getAccessTokenSilently } = useAuth0();

  const fetchUser = async (username) => {
    if (!username) throw new Error("artistId is required");

    try {
      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_API_IDENTIFIER,
      });

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/fetchUser/${username}}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch user");

      return data;
    } catch (err) {
      console.error("fetchUser error:", err.message);
      throw err;
    }
  };

  return fetchUser;
}

export default useFetchUser;

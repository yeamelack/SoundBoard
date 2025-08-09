import { useAuth0 } from "@auth0/auth0-react";

function useInsertUser() {
  const { getAccessTokenSilently } = useAuth0();

  const insertUser = async (usersub, normalizedUsername) => {
    try {
      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_API_IDENTIFIER,
      });

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/insertUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ usersub, normalizedUsername }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    } catch (err) {
      console.error("Insert failed:", err.message);
      throw err;
    }
  };

  return insertUser;
}

export default useInsertUser;

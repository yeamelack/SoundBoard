import { useAuth0 } from "@auth0/auth0-react";

function useInsertReviews() {
  const { getAccessTokenSilently } = useAuth0();

  const insertReview = async (reviewData) => {
    try {
      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_API_IDENTIFIER,
      });

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/insertReview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reviewData),
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

  return insertReview;
}

export default useInsertReviews;

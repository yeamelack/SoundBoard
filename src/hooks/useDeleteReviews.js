import { useAuth0 } from "@auth0/auth0-react";

function useDeleteReviews() {
  const { getAccessTokenSilently } = useAuth0();

  const deleteReview = async (reviewId) => {
    try {
      // Get Auth0 access token
      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_API_IDENTIFIER,
      });

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/deleteReview/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    } catch (err) {
      console.error("Update failed:", err.message);
      throw err;
    }
  };

  return deleteReview;
}

export default useDeleteReviews;

import "../styles/Rating/Rating.css";
import Header from "../components/Header/Header";
import RatedAlbums from "../components/Rating/RatedAlbums";
import supabase from "../supabase/supabaseClient";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function Rating() {
  const { user } = useAuth0();
  const { username } = useParams();
  const location = useLocation();
  const [reviews, setReviews] = useState(location.state || []);

  console.log("location.state");

  useEffect(() => {
    if (reviews.length !== 0) {
      console.log("aasds");

      return;
    }

    const fetchAllUserReviews = async () => {
      console.log("aasds");
      const { data, error } = await supabase
        .from("musicreviews")
        .select(
          `
        *,
        music (
          coverart,title,
          artists(
            artistName,
            artistid,
            profilepic
          )
        )
      `
        )
        .eq("username", username)
        .order("date", { ascending: false });

      if (error) {
        console.error("Fetching user rated albums failed", error);
        return;
      }
      setReviews(data);
    };

    fetchAllUserReviews();
  }, []);

  if (!reviews) {
    return <div>loading....</div>;
  }
  return (
    <div className="rating-page-grid">
      <div>
        <Header />
      </div>
      <div className="rated-albums-container">
        <div className="rated-albums-flex">
          <div style={{ flex: "1px", gap: "10px" }}>
            {reviews.map((review, i) => (
              <RatedAlbums key={i} review={review} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rating;

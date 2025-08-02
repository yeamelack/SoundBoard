import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import supabase from "../../supabase/supabaseClient.js";
import RecentActivityAlbums from "../../components/UserProfile/RecentActivityAlbums.jsx";
import "../../styles/UserProfile/RecentActivity.css";

function RecentActivity() {
  const { user } = useAuth0();
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    const fetchRecentAlbums = async () => {
      const { data: reviews, error: reviewError } = await supabase
        .from("musicreviews")
        .select("*")
        .eq("userid", user.sub);

      if (reviews && !reviewError) {
        const reversedReviews = reviews.reverse().slice(0, 7);

        const combined = await Promise.all(
          reversedReviews.map(async (review) => {
            const { data: musicData, error: musicError } = await supabase
              .from("music")
              .select("albumid, artistid, coverart, title")
              .eq("albumid", review.albumid)
              .single();

            if (musicError || !musicData) return null;

            return {
              ...musicData,
              starrating: review.starrating,
              reviewtitle: review.reviewtitle,
              reviewbody: review.reviewbody,
            };
          })
        );

        // Filter out any null values if a music fetch failed
        setCombinedData(combined.filter(Boolean));
      }
    };

    if (user?.sub) {
      fetchRecentAlbums();
    }
  }, [user?.sub]);

  return (
    <div className="recent-activity-container">
      <div className="recent-activity">
        {combinedData.map((album, i) => (
          <RecentActivityAlbums
            key={i}
            title={album.title}
            rating={album.starrating}
            imgLink={album.coverart}
          />
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;

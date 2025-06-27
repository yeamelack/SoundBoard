import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import supabase from "../../supabase/supabaseClient.js";
import RecentActivityAlbums from "../../components/UserProfile/RecentActivityAlbums.jsx";
import "../../styles/UserProfile/RecentActivity.css";
import { Link, useParams } from "react-router-dom";

function RecentActivity() {
  const { user } = useAuth0();
  const params = useParams();
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
              .select("*")
              .eq("albumid", review.albumid)
              .single();

            if (musicError || !musicData) return null;

            return {
              ...musicData,
              starrating: review.starrating,
              reviewtitle: review.reviewtitle,
              reviewbody: review.reviewbody,
              userid: review.userid,
              albumreviewid: review.albumreviewid,
            };
          })
        );

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
          <Link
            to={`/${params.username}/rating/${album.albumreviewid}`}
            state={{ album }}
            key={i}
          >
            <RecentActivityAlbums
              title={album.title}
              rating={album.starrating}
              imgLink={album.coverart}
              ratingId={album.albumreviewid}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;

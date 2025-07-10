import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import supabase from "../../supabase/supabaseClient.js";
import RecentActivityAlbums from "../../components/UserProfile/RecentActivityAlbums.jsx";
import "../../styles/UserProfile/RecentActivity.css";
import { Link, useParams } from "react-router-dom";

import { useUser } from "../../misc/UserContext";

function RecentActivity() {
  const username = useParams().username;
  const userInfo = useUser();

  const { user } = useAuth0();
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    const fetchRecentAlbums = async () => {
      const { data: reviews, error } = await supabase
        .from("musicreviews")
        .select("*")
        .eq("username", username)
        .order("date", { ascending: false }) // newest first
        .limit(6);

      if (error) {
        console.error("Error fetching reviews:", error);
        return;
      }

      const combined = await Promise.all(
        (reviews ?? []).map(async (review) => {
          const { data: musicData, error: musicError } = await supabase
            .from("music")
            .select("*")
            .eq("albumid", review.albumid)
            .single();

          if (musicError || !musicData) {
            console.error(
              `Error fetching music for album ${review.albumid}`,
              musicError
            );
            return null;
          }

          return {
            ...musicData,
            date: review.date,
            starrating: review.starrating,
            reviewtitle: review.reviewtitle,
            reviewbody: review.reviewbody,
            username: review.username,
            albumreviewid: review.albumreviewid,
          };
        })
      );

      setCombinedData(combined.filter(Boolean));
    };

    if (username) {
      fetchRecentAlbums();
    }
  }, [username]);
  console.log("combinedData");

  console.log(combinedData);
  if (!combinedData) {
    return <div>Loading...</div>;
  }

  if (combinedData.length === 0) {
    return <div>No albums reviewed</div>;
  }

  return (
    <div className="recent-activity-container">
      <div className="recent-activity">
        {combinedData.map((album, i) => (
          <Link
            to={`/${username}/rating/${album.albumreviewid}`}
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

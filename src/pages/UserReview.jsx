import UserReviewsStyle from "../styles/UserReviews/UserReviews.module.css";
import { useUser } from "../misc/UserContext";
import Header from "../components/Header/Header";
import ReviewContainer from "../components/UserReview/ReviewContainer";
import IndividualReview from "../components/UserRating page/IndividualReview";
import { useLocation, Link, useParams } from "react-router-dom";
import supabase from "../supabase/supabaseClient";
import { useEffect, useState } from "react";
import userInfo from "../misc/UserContext";
import WrittenReviewsContainer from "../components/UserReview/WrittenReviewsContainer";

function UserReviews() {
  const [writtenReviews, setWrittenReviews] = useState([]);
  const { username } = useParams();
  const { userInfo } = useUser();

  useEffect(() => {
    const fetchAllUserReviews = async () => {
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
      const reviews = data?.filter(
        (r) => r.reviewtitle && r.reviewtitle.trim() !== ""
      );

      setWrittenReviews(reviews);
    };

    fetchAllUserReviews();
  }, [userInfo]);

  if (!writtenReviews){
    return <div>Loading....</div>
  }
    return (
      <div className={UserReviewsStyle["user-reviews-grid"]}>
        <div style={{ flex: "0" }}>
          <Header />
          <div className={UserReviewsStyle["review-by-title-container"]}>
            {"Reviews by\u00A0"}
            <span className={UserReviewsStyle["review-by-title"]}>
              <Link to={`/${username}`}>{username}</Link>
            </span>
          </div>

          <div className={UserReviewsStyle["user-reviews-bottom-grid"]}>
            {writtenReviews.map((review, i) => (
              <WrittenReviewsContainer key={i} review={review} />
            ))}
          </div>
        </div>
      </div>
    );
}

export default UserReviews;

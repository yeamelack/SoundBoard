import "../../styles/HomePage/ReviewBox.css";
import CancelButton from "../../assets/icons/cancel-button.svg";
import StarRating from "../StarRating/StarRating";
import { useState, useEffect } from "react";
import React from "react";
import supabase from "../../supabase/supabaseClient";
import { useClickContext } from "../../misc/ClickContext";
import { useUser } from "../../misc/UserContext";
import useUpdateReviews from "../../hooks/useUpdateReviews";
import useInsertReviews from "../../hooks/useInsertReviews";

function ReviewBox({
  result,
  toggleVisiablity,
  starrating = 0,
  currentTitle = "",
  reviewbody = "",
  reviewId = -1, //-1 = new review
  setEditedStars,
}) {
  const updateReviews = useUpdateReviews();
  const insertReviews = useInsertReviews();

  const isEditing = !!(currentTitle || reviewbody || starrating);
  const userInfo = useUser();
  const { handleClick } = useClickContext();
  const [overlayVisiablity, setOverlayVisiablity] = useState(false);
  const [rating, setRating] = useState(starrating || 0);
  const [review, setReview] = useState(reviewbody || "");
  const [title, setTitle] = useState(currentTitle || "");
  const [artistInfo, setArtistInfo] = useState(null);

  const getReviewInput = (event) => setReview(event.target.value);
  const getTitleInput = (event) => setTitle(event.target.value);

  useEffect(() => {
    if (result) {
      setOverlayVisiablity(true);
    }
  }, [result]);

  const closeOverlay = () => {
    setOverlayVisiablity(false);
    setRating(0);
    if (typeof toggleVisiablity === "function") {
      toggleVisiablity();
    }
  };

  useEffect(() => {
    const getArtistInfo = async () => {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .eq("artistid", result.artistid)
        .single();

      if (data) {
        setArtistInfo({
          artistName: data.artistName,
          artistid: data.artistid,
          profilepic: data.profilepic,
        });
        console.log(data);
      }
    };

    getArtistInfo();
  }, [result]);

  const submitReview = async () => {
    const hasRating = rating !== null && rating !== 0;
    const hasTitle = title.trim().length !== 0;
    const hasReview = review.trim().length !== 0;

    const validSubmission =
      (hasRating && !hasTitle && !hasReview) ||
      (hasRating && hasTitle && hasReview);

    if (!validSubmission) {
      return alert(
        "Please enter a rating, or a title WITH a review OR please enter a star rating."
      );
    }

    if (reviewId !== -1) {
      //edit review
      setEditedStars(rating);
      try {
        await updateReviews(reviewId, {
          starrating: rating,
          reviewbody: review,
          reviewtitle: title,
          date: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Failed to update review:", err.message);
      }
    } else {
      // Insert new review
      try {
        await insertReviews({
          username: userInfo.userInfo.username,
          albumid: result.albumid,
          reviewbody: review,
          reviewtitle: title,
          date: new Date().toISOString(),
          starrating: rating,
          userid: userInfo.userInfo.auth0id,
        });
      } catch (err) {
        console.error("Failed to insert review:", err);
      }
    }
    closeOverlay();
    setTitle(""); //clears title box so box clean for next use
    setReview(""); //clears review box so box clean for next use
    handleClick(false);
  };

  if (!artistInfo) return;

  return (
    <>
      {overlayVisiablity && (
        <div className="overlay">
          <div className="review-box-container">
            <div className="above-text-box">
              <div className="review-box-album-info">
                <div className="review-box-album-img-container">
                  <img
                    className="review-box-album-img"
                    src={result.coverart}
                    alt={`${result.title} album cover.`}
                  />
                </div>

                <div className="review-box-album-title-artist-container">
                  <div className="review-box-album-title-text-container">
                    <span className="review-box-album-title-text">
                      {result.title}
                    </span>
                  </div>

                  <div className="review-box-artist-name-text-container">
                    <span className="review-box-artist-name-text">
                      {artistInfo.artistName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="review-stars-container">
                <StarRating currentRating={rating} onRatingChange={setRating} />
              </div>

              <div className="cancel-button-container" onClick={closeOverlay}>
                <img
                  className="cancel-button"
                  src={CancelButton}
                  alt="cancel-button"
                />
              </div>
            </div>

            <div className="review-container">
              <div className="title-container">
                <textarea
                  className="title-textbox"
                  placeholder="Add a title"
                  onChange={getTitleInput}
                  value={title}
                />
              </div>

              <div className="review-text-container">
                <textarea
                  className="review-textbox"
                  placeholder="Add a review"
                  onChange={getReviewInput}
                  value={review}
                />
              </div>
            </div>

            <div className="review-box-sumbit-button-container">
              <button
                className="review-submit-button"
                onClick={() => {
                  handleClick("ReviewBox-Submit");
                  submitReview();
                }}
              >
                {isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReviewBox;

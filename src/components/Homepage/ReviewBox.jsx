import "../../styles/HomePage/ReviewBox.css";
import CancelButton from "../../assets/icons/cancel-button.svg";
import { useAuth0 } from "@auth0/auth0-react";
import StarRating from "../StarRating/StarRating";

import { useState, useEffect } from "react";
import React from "react";
import supabase from "../../supabase/supabaseClient";
import { useClickContext } from "../../misc/ClickContext";

function ReviewBox({
  result,
  toggleVisiablity,
  starrating = 0,
  currentTitle = "",
  reviewbody = "",
  reviewId = -1,
  setEditedStars,
}) {
  const isEditing = !!(currentTitle || reviewbody || starrating);

  const { setClicked } = useClickContext();
  const [overlayVisiablity, setOverlayVisiablity] = useState(false);
  const [rating, setRating] = useState(starrating || 0);
  const [review, setReview] = useState(reviewbody || "");
  const [title, setTitle] = useState(currentTitle || "");
  const [artistInfo, setArtistInfo] = useState(null);

  const { user, isAuthenticated } = useAuth0();

  const getReviewInput = (event) => setReview(event.target.value);
  const getTitleInput = (event) => setTitle(event.target.value);

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
      }
    };

    getArtistInfo();
  }, [result]);

  useEffect(() => {
    if (result) {
      setOverlayVisiablity(true);
    }
  }, [result]);

  // Resync state if props change (useful when switching to "edit mode")
  useEffect(() => {
    setRating(starrating || 0);
    setTitle(currentTitle || "");
    setReview(reviewbody || "");
  }, [starrating, currentTitle, reviewbody]);

  const closeOverlay = () => {
    setOverlayVisiablity(false);
    setRating(0);
    if (typeof toggleVisiablity === "function") {
      toggleVisiablity();
    }
  };

  const submitReview = async () => {
    const hasRating = rating !== null;
    const hasTitle = title.trim().length !== 0;
    const hasReview = review.trim().length !== 0;

    const validSubmission =
      (hasRating && !hasTitle && !hasReview) ||
      (hasRating && hasTitle && hasReview);

    if (!validSubmission) {
      return alert("Please enter a rating, or a title WITH a review.");
    }

    if (reviewId !== -1) {
      setEditedStars(rating);
      const { error: updateError } = await supabase
        .from("musicreviews")
        .update({
          reviewbody: review,
          reviewtitle: title,
          starrating: rating,
          date: new Date().toISOString(),
        })
        .eq("albumreviewid", reviewId);

      if (updateError) {
        console.error("Error updating review:", updateError);
        return;
      }
    } else {
      // Insert new review
      const { error: insertError } = await supabase
        .from("musicreviews")
        .insert({
          userid: user.sub,
          albumid: result.albumid,
          reviewbody: review,
          reviewtitle: title,
          date: new Date().toISOString(),
          starrating: rating,
        });

      if (insertError) {
        console.error("Error inserting review:", insertError);
        return;
      }
    }

    closeOverlay();
    setClicked(false);
  };

  if (!artistInfo) return <div>Loading artist info...</div>;

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
                  setClicked(true);
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

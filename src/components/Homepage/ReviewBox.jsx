import "../../styles/HomePage/ReviewBox.css";
import CancelButton from "../../assets/icons/cancel-button.svg";
import { useAuth0 } from "@auth0/auth0-react";
import dayjs from "dayjs";

import RatingReview from "./RatingReview.jsx";
import { useState, useEffect } from "react";
import React from "react";
import supabase from "../../supabase/supabaseClient";

function ReviewBox({ result, toggleVisiablity }) {
  const [overlayVisiablity, setOverlayVisiablity] = useState(false);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [title, setTitle] = useState("");
  const [formError, setFormError] = useState(null);

  const { user, isAuthenticated } = useAuth0();

  const getReviewInput = (event) => {
    setReview(event.target.value);
  };

  const getTitleInput = (event) => {
    setTitle(event.target.value);
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (!review || !title || !rating) {
      setFormError("Please fill in all the required fields");
      return;
    }

    const dateObj = new Date();         // or Date.parse(...)
    const formattedDate = dateObj.toISOString();

    const reviewData = {
      userid: user.sub,
      albumid: result.id,
      reviewbody: review,
      reviewtitle: title,
      date: formattedDate,
      starrating: rating,
    };

    console.log("Submitting review:", reviewData);

    const { data, error } = await supabase
      .from("musicreviews")
      .insert([reviewData]);

    if (error) {
      console.error("Supabase insert error:", error);
      setFormError("Database error: " + error.message);
      return;
    }

    if (data) {
      setFormError(null);
      setOverlayVisiablity(false); 
    }
  };

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

  return (
    <>
      {overlayVisiablity && (
        <div className="overlay">
          <form action="">
            <div className="review-box-container">
              <div className="above-text-box">
                <div className="review-box-album-info">
                  <div className="review-box-album-img-container">
                    <img
                      className="review-box-album-img"
                      src={result.images[0].url}
                      alt={`${result.name} album cover.`}
                    />
                  </div>

                  <div className="review-box-album-title-artist-container">
                    <div className="review-box-album-title-text-container">
                      <span className="review-box-album-title-text">
                        {result.name}
                      </span>
                    </div>

                    <div className="review-box-artist-name-text-container">
                      <span className="review-box-artist-name-text">
                        {result.artists[0].name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="review-stars-container">
                  <RatingReview rating={rating} setRating={setRating} />
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
                  ></textarea>
                </div>

                <div className="review-text-container">
                  <textarea
                    className="review-textbox"
                    placeholder="Add a review"
                    onChange={getReviewInput}
                  ></textarea>
                </div>
              </div>

              <div className="review-box-sumbit-button-container">
                <button className="review-submit-button" onClick={submitReview}>
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default ReviewBox;

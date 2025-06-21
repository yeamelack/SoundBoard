import "../../styles/HomePage/ReviewBox.css";
import CancelButton from "../../assets/icons/cancel-button.svg";
import { useAuth0 } from "@auth0/auth0-react";
import dayjs from "dayjs";

import RatingReview from "./RatingReview.jsx";
import { useState, useEffect } from "react";
import React from "react";
import supabase from "../../supabase/supabaseClient";

function ReviewBox({ result, toggleVisiablity }) {
  console.log(result);
  const [overlayVisiablity, setOverlayVisiablity] = useState(false);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [title, setTitle] = useState("");
  const [artistInfo, setArtistInfo] = useState(null);

  const { user, isAuthenticated } = useAuth0();

  const getReviewInput = (event) => {
    setReview(event.target.value);
  };

  const getTitleInput = (event) => {
    setTitle(event.target.value);
  };

  useEffect(() => {
    const getArtistInfo = async () => {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .eq("artistid", result.artistid)
        .single();

        console.log(data)

      if (data) {
        setArtistInfo({
          artistName: data.artistName,
          artistid: data.artistid,
          profilepic: data.profilepic,
        });
      }
    };

    getArtistInfo();
    console.log(artistInfo);
  }, [result]);

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
  if (!artistInfo) return <div>Loading artist info...</div>;

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
                <button className="review-submit-button">Submit</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default ReviewBox;

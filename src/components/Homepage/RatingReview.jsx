import React, { useState } from "react";

function RatingReview({ rating, setRating }) {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="star"
          style={{
            cursor: "pointer",
            color: (hoveredRating || rating) >= star ? "gold" : "gray",
            fontSize: "35px",
            transition: "color 0.2s ease",
          }}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default RatingReview;

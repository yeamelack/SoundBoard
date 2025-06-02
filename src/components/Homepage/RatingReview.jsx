import React, { useState } from "react";

function RatingReview({ rating, setRating }) {
  const [hover, setHover] = useState(0);
  console.log(rating);
  
  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="star"
          style={{
            cursor: "pointer",
            color: 
              // If hovering on a star above current rating, use hover logic
              hover > rating && star <= hover ? "gold" :
              // If not hovering or hovering on rated stars, use rating logic
              star <= rating ? "gold" : "gray",
            fontSize: "30px",
            opacity: hover >= rating  ? 0.7 : 1,
          }}
          onMouseEnter={() => {
            // Only set hover if star is above current rating
            if (star > rating) {
              setHover(star);
            }
          }}
          onMouseLeave={() => setHover(0)}
          onClick={() => setRating(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default RatingReview
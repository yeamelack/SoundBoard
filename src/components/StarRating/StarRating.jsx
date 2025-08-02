import React, { useState } from "react";
import "../../styles/StarRating/StarRating.css";

const StarRating = ({ currentRating, onRatingChange }) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="rating">
      {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5].map((value) => (
        <React.Fragment key={value}>
          <input
            type="radio"
            id={`star${value}`}
            name="rating"
            value={value}
            checked={currentRating === value}
            onChange={() => onRatingChange(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(null)}
          />
          <label
            htmlFor={`star${value}`}
            className={Number.isInteger(value) ? "full" : "half"}
            title={value === 5 ? "Awesome" : ""}
          ></label>
        </React.Fragment>
      ))}
    </div>
  );
};

export default StarRating;
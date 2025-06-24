import React from "react";
import "../../styles/StarRating/StarRating.css";

const StarDisplay = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<i key={i} className="fa fa-star" style={{ color: "#ffb400" }}></i>);
    } else if (rating >= i - 0.5) {
      stars.push(<i key={i} className="fa fa-star-half-o" style={{ color: "#ffb400" }}></i>);
    } else {
      stars.push(<i key={i} className="fa fa-star-o" style={{ color: "#ffb400" }}></i>);
    }
  }

  return <div className="rating-static">{stars}</div>;
};

export default StarDisplay;

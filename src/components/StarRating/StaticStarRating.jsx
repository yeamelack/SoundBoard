import React from "react";
import "../../styles/StarRating/StarRating.css";

const StarDisplay = ({ rating, size = "16px" }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    const style = { color: "#ffb400", fontSize: size };

    if (rating >= i) {
      stars.push(<i key={i} className="fa fa-star" style={style}></i>);
    } else if (rating >= i - 0.5) {
      stars.push(<i key={i} className="fa fa-star-half-o" style={style}></i>);
    } else {
      stars.push(<i key={i} className="fa fa-star-o" style={style}></i>);
    }
  }

  return <div className="rating-static">{stars}</div>;
};

export default StarDisplay;

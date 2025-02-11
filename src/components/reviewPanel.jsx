import React from "react";
import "../styles/review.css";

const ReviewsPanel = ({ reviews }) => {
  return (
    <div className="reviews-panel">
      <h3>Reseñas Recientes</h3>
      {reviews.length === 0 ? (
        <p className="no-reviews">Aún no hay reseñas.</p>
      ) : (
        reviews.map((r, index) => (
          <div key={index} className="review-item">
            <h4>{r.title}</h4>
            <p className="review-meta">
              {r.group} | {r.date} |{" "}
              <span className="stars">{Array(r.rating).fill("★").join("")}</span>
            </p>
            <p>{r.review}</p>
          </div>
        ))
      )}

      
    </div>
  );
};

export default ReviewsPanel;

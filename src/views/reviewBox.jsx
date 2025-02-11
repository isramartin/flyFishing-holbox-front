import React, { useState } from "react";
import ReviewForm from "../components/reviewForm";
import ReviewsPanel from "../components/reviewPanel";
import "../styles/review.css";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleNewReview = (newReview) => {
    setReviews([...reviews, newReview]);
    setShowForm(false);
  };

  return (
    <div className="review-container">
     
      {!showForm ? (
        <>
          <button className="add-review-btn" onClick={() => setShowForm(true)}>
            Escribir una Reseña
          </button>
          <ReviewsPanel reviews={reviews} />
        </>
      ) : (
      <>
      
        <ReviewForm onSubmit={handleNewReview} />
        </>
      )}
      
    </div>
  );
};

export default Review;

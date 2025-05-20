import React from "react";
import "../../styles/Skeleton/ArticleSkeleton.css";

const ArticleSkeletonCard = () => {
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="article-card">
        <div className="article-inner skeleton-inner">
          <div className="article-front skeleton-front">
            <div className="image-container skeleton-box" />
            <div className="skeleton-title skeleton-box" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleSkeletonCard;

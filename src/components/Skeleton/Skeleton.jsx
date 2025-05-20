import React from "react";
import "../../styles/Skeleton/Skeleton.css"

const Skeleton = ({ type = "text", width, height, count = 1, circle = false, className = "" }) => {
  const elements = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`skeleton ${type} ${circle ? "circle" : ""} ${className}`}
      style={{
        width: width || (circle ? height : "100%"),
        height: height || (circle ? width : "auto"),
      }}
    />
  ));

  return <>{elements}</>;
};

export default Skeleton;
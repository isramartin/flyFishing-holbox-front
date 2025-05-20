import React from "react";
import Skeleton from "./Skeleton";

const SkeletonContainer = ({ isLoading, children, skeletonProps, count = 1 }) => {
  if (isLoading) {
    return Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} {...skeletonProps} />
    ));
  }
  return children;
};

export default SkeletonContainer;
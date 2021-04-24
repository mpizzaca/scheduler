import React from "react";
import SkeletonDay from "./SkeletonDay";

export default function SkeletonDays(props) {
  const getSkeletonDays = () => {
    const skeletonDays = [];
    let skeletonCount = props.count || 5;
    while (skeletonCount > 0) {
      skeletonDays.push(<SkeletonDay />);
      skeletonCount--;
    }
    return skeletonDays;
  };

  return <ul>{getSkeletonDays()}</ul>;
}

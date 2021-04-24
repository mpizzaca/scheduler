import React from "react";
import Skeleton from "react-loading-skeleton";

export default function SkeletonDay() {
  return (
    <li className="day-list__item" data-testid="day">
      <h2 className="text--regular">
        <Skeleton
          style={{
            maxWidth: "70px",
            backgroundColor: "#999999",
            backgroundImage:
              "linear-gradient( 90deg, #999999, #c7c7c7, #999999 )",
          }}
          width="30%"
        />
      </h2>
      <h3 className="text--light">
        <Skeleton
          style={{
            maxWidth: "140px",
            backgroundColor: "#999999",
            backgroundImage:
              "linear-gradient( 90deg, #999999, #c7c7c7, #999999 )",
          }}
          width="65%"
        />
      </h3>
    </li>
  );
}

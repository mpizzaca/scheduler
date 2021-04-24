import React from "react";
import SkeletonAppointment from "./SkeletonAppointment";

export default function SkeletonAppointments(props) {
  const getSkeletonAppointments = () => {
    const skeletonAppointments = [];
    let skeletonCount = props.count || 5;
    while (skeletonCount > 0) {
      skeletonAppointments.push(<SkeletonAppointment />);
      skeletonCount--;
    }
    return skeletonAppointments;
  };
  return <>{getSkeletonAppointments()}</>;
}

import React from "react";
import classNames from "classnames";
import "./DayListItem.scss";

const formatSpots = (spotCount) => {
  if (spotCount === 0) {
    return "no spots remaining";
  }
  if (spotCount === 1) {
    return "1 spot remaining";
  }
  return `${spotCount} spots remaining`;
};

export default function DayListItem(props) {
  const { name, spots, selected, setDay } = props;
  const listItemClass = classNames(
    "day-list__item",
    { "day-list__item--selected": selected },
    { "day-list__item--full": spots === 0 }
  );
  return (
    <li
      className={listItemClass}
      onClick={() => setDay(name)}
      data-testid="day"
    >
      <h2 className="text--regular">{name}</h2>
      <h3 className="text--light">{formatSpots(spots)}</h3>
    </li>
  );
}

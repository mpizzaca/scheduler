import React from "react";
import Skeleton from "react-loading-skeleton";

export default function SkeletonAppointment() {
  const skeletonStyle = {
    background:
      "linear-gradient(90deg, #54a0ff25, #54a0ff25 8px, rgba(84, 160, 255, 0.05) 0, rgba(84, 160, 255, 0.05))",
  };

  return (
    <article className="appointment" data-testid="appointment">
      <header className="appointment__time">
        <h4 className="text--semi-bold">
          <Skeleton width={"20px"} height={"10px"} />
        </h4>
        <hr className="appointment__separator" />
      </header>
      <main
        style={skeletonStyle}
        className="appointment__card appointment__card--show"
      >
        <section className="appointment__card-left">
          <h2 className="text--regular">
            <Skeleton />
          </h2>
          <section className="interviewer">
            <h4 className="text--light">
              <Skeleton width={"20%"} />
            </h4>
            <h3 className="text--regular">
              <Skeleton width={"30%"} />
            </h3>
          </section>
        </section>
        <section className="appointment__card-right">
          <section className="appointment__actions">
            <img
              className="appointment__actions-button"
              src="images/edit.png"
              alt="Edit"
            />
            <img
              className="appointment__actions-button"
              src="images/trash.png"
              alt="Delete"
            />
          </section>
        </section>
      </main>
    </article>
  );
}

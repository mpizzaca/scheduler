import React from "react";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import useApplicationData from "../hooks/useApplicationData";
import "components/Application.scss";
import {
  getAppointmentsForDay,
  getInterviewersForDay,
  getInterview,
} from "../helpers/selectors";
import SkeletonAppointment from "./SkeletonAppointment";

export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  } = useApplicationData();

  const interviewers = getInterviewersForDay(state, state.day);
  const appointmentComponents = getAppointmentsForDay(state, state.day).map(
    (appointment) => {
      const interview = getInterview(state, appointment.interview);
      return (
        <Appointment
          key={appointment.id}
          {...appointment}
          interviewers={interviewers}
          interview={interview}
          bookInterview={bookInterview}
          cancelInterview={cancelInterview}
        />
      );
    }
  );

  const noAppointments = appointmentComponents.length === 0;
  const skeletonAppointments = [];
  if (noAppointments) {
    let skeletonCount = 5;
    while (skeletonCount > 0) {
      skeletonAppointments.push(<SkeletonAppointment />);
      skeletonCount--;
    }
  }

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {noAppointments && skeletonAppointments}
        {appointmentComponents}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}

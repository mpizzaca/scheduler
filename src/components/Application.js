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
import SkeletonAppointments from "./Skeletons/SkeletonAppointments";
import SkeletonDays from "./Skeletons/SkeletonDays";

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
  const noDays = state.days.length === 0;

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
          {noDays && <SkeletonDays />}
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {noAppointments && <SkeletonAppointments />}
        {appointmentComponents}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}

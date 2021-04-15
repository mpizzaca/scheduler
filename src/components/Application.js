import React, { useState, useEffect } from "react";
import axios from "axios";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import "components/Application.scss";
import {
  getAppointmentsForDay,
  getInterviewersForDay,
  getInterview,
} from "../helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    const daysPromise = axios.get("/api/days");
    const appointmentsPromise = axios.get("/api/appointments");
    const interviewersPromise = axios.get("/api/interviewers");

    Promise.all([daysPromise, appointmentsPromise, interviewersPromise]).then(
      (all) => {
        setState((prev) => ({
          ...prev,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        }));
      }
    );
  }, []);

  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);
  const appointmentComponents = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        {...appointment}
        interviewers={interviewers}
        interview={interview}
      />
    );
  });

  const setDay = (day) => setState({ ...state, day });

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
        {appointmentComponents}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}

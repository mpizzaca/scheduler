import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.put(`/api/appointments/${id}`, { ...appointment }).then(() => {
      setState({ ...state, appointments });

      // update 'spots remaining'
      for (const day of state.days) {
        if (day.appointments.find((apt) => apt === id)) {
          const newDays = [...state.days];
          newDays[day.id - 1].spots -= 1;
          setState((prev) => {
            return { ...prev, days: newDays };
          });
        }
      }
    });
  };

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.delete(`/api/appointments/${id}`).then(() => {
      setState({ ...state, appointments });

      // update 'spots remaining'
      for (const day of state.days) {
        if (day.appointments.find((apt) => apt === id)) {
          const newDays = [...state.days];
          newDays[day.id - 1].spots += 1;
          setState((prev) => {
            return { ...prev, days: newDays };
          });
        }
      }
    });
  };

  const setDay = (day) => setState({ ...state, day });

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

  return { state, setDay, bookInterview, cancelInterview };
}

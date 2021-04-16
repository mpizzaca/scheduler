import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_DAYS = "SET_DAYS";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_APPOINTMENTS = "SET_APPOINTMENTS";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";

export default function useApplicationData() {
  const reducer = (state, action) => {
    const {
      type,
      day,
      days,
      appointments,
      interviewers,
      id,
      interview,
    } = action;
    switch (type) {
      case SET_DAY:
        return { ...state, day };
      case SET_APPLICATION_DATA:
        return { ...state, days, appointments, interviewers };
      case SET_DAYS:
        return { ...state, days };
      case SET_APPOINTMENTS:
        return { ...state, appointments };
      case SET_INTERVIEW:
        return {
          ...state,
          appointments: {
            ...state.appointments,
            [id]: { ...state.appointments[id], interview },
          },
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => dispatch({ type: SET_DAY, day });

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
      dispatch({ type: SET_APPOINTMENTS, appointments });

      // update 'spots remaining'
      // TODO: this runs when editing an appointment, erroneously reducing the spots remaining
      for (const day of state.days) {
        if (day.appointments.find((apt) => apt === id)) {
          const days = [...state.days];
          days[day.id - 1].spots -= 1;
          dispatch({ type: SET_DAYS, days });
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
      dispatch({ type: SET_APPOINTMENTS, appointments });

      // update 'spots remaining'
      for (const day of state.days) {
        if (day.appointments.find((apt) => apt === id)) {
          const days = [...state.days];
          days[day.id - 1].spots += 1;
          dispatch({ type: SET_DAYS, days });
        }
      }
    });
  };

  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    webSocket.onopen = (evt) => {
    };

    webSocket.onmessage = (evt) => {
      const cmd = JSON.parse(evt.data);
      dispatch(cmd);
    };

    const daysPromise = axios.get("/api/days");
    const appointmentsPromise = axios.get("/api/appointments");
    const interviewersPromise = axios.get("/api/interviewers");

    Promise.all([daysPromise, appointmentsPromise, interviewersPromise]).then(
      (all) => {
        dispatch({
          type: SET_APPLICATION_DATA,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        });
      }
    );

    return () => webSocket.close();
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
}

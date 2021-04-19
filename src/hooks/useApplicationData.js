import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const UPDATE_SPOTS = "UPDATE_SPOTS";
const SET_INTERVIEW = "SET_INTERVIEW";
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
      case UPDATE_SPOTS:
        const currentDay = state.days.find((day) => day.name === state.day);
        const emptyAppointments = currentDay.appointments.filter(
          (appointmentId) =>
            state.appointments[appointmentId].interview === null
        );
        const newDays = [...state.days];
        newDays[currentDay.id - 1].spots = emptyAppointments.length;
        return {
          ...state,
          days: newDays,
        };
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

  // set interview data for a given appointment id
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    return axios.put(`/api/appointments/${id}`, { ...appointment }).then(() => {
      dispatch({ type: SET_INTERVIEW, id, interview });
      dispatch({ type: UPDATE_SPOTS });
    });
  };

  // set interview=null for a given appointment id
  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`).then(() => {
      dispatch({ type: SET_INTERVIEW, id, interview: null });
      dispatch({ type: UPDATE_SPOTS });
    });
  };

  useEffect(() => {
    // setup websocket listener to render updates other users make
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    webSocket.onmessage = (evt) => {
      const cmd = JSON.parse(evt.data);
      dispatch(cmd);
    };

    // fetch data to initialize app state
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

import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_DAYS = "SET_DAYS";
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
      case SET_DAYS:
        return { ...state, days };
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
    });
  };

  // set interview=null for a given appointment id
  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`).then(() => {
      dispatch({ type: SET_INTERVIEW, id, interview: null });
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

  // update 'spots remaining' when appointments change
  useEffect(() => {
    axios.get("/api/days").then((res) => {
      dispatch({ type: SET_DAYS, days: res.data });
    });
  }, [state.appointments]);

  return { state, setDay, bookInterview, cancelInterview };
}

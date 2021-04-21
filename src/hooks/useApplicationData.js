import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_INTERVIEW,
  SET_APPLICATION_DATA,
  UPDATE_SPOTS_REMAINING,
} from "../reducers/application";

export default function useApplicationData() {
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
      dispatch({ type: UPDATE_SPOTS_REMAINING });
    });
  };

  // set interview=null for a given appointment id
  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`).then(() => {
      dispatch({ type: SET_INTERVIEW, id, interview: null });
      dispatch({ type: UPDATE_SPOTS_REMAINING });
    });
  };

  useEffect(() => {
    // setup websocket listener to render updates other users make
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    webSocket.onmessage = (evt) => {
      // dispatch the received event to the reducer
      dispatch(JSON.parse(evt.data));
      // the event will either be a new or deleted interview -> update spots remaining for all days
      dispatch({ type: UPDATE_SPOTS_REMAINING });
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

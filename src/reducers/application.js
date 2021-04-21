const SET_DAY = "SET_DAY";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const UPDATE_SPOTS_REMAINING = "UPDATE_SPOTS_REMAINING";

const reducer = (state, action) => {
  const { type, day, days, appointments, interviewers, id, interview } = action;
  switch (type) {
    case SET_DAY:
      return { ...state, day };
    case SET_APPLICATION_DATA:
      return { ...state, days, appointments, interviewers };
    case UPDATE_SPOTS_REMAINING:
      const newDays = [...state.days];
      newDays.forEach((currentDay) => {
        const emptyAppointments = currentDay.appointments.filter(
          (appointmentId) =>
            state.appointments[appointmentId].interview === null
        );
        newDays[currentDay.id - 1].spots = emptyAppointments.length;
      });
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
      throw new Error(`Tried to reduce with unsupported action type: ${type}`);
  }
};

export default reducer;
export { SET_DAY, SET_INTERVIEW, SET_APPLICATION_DATA, UPDATE_SPOTS_REMAINING };

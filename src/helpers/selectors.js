export function getAppointmentsForDay(state, day) {
  const selectedDay = state.days.find((ele) => ele.name === day);
  if (!selectedDay || Object.keys(state.appointments).length === 0) return [];
  return selectedDay.appointments.map(
    (appointment) => state.appointments[appointment]
  );
}

export function getInterviewersForDay(state, day) {
  const selectedDay = state.days.find((ele) => ele.name === day);
  if (!selectedDay) return [];
  return selectedDay.interviewers.map(
    (interviewer) => state.interviewers[interviewer]
  );
}

export function getInterview(state, interview) {
  if (!interview || !state.interviewers[interview.interviewer]) return null;
  const interviewer = state.interviewers[interview.interviewer];
  return {
    student: interview.student,
    interviewer,
  };
}

/*

fc: return number of spots available for a day

const nbSpots = (state, day) => {
  const selectedDay = state.days.find(ele => ele.name === day);
  return selectedDay.appointments.filter(appointment => state.appointments[appointment].interview === null).length
}

*/

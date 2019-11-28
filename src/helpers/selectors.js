

export function getAppointmentsForDay(state, day) {
  let result = [];
  const findDay = () => state.days.filter(i => i.name === day)
  const days = findDay()
  if (days.length === 0) return result;
  const appointmentsFound = days[0].appointments
  appointmentsFound.forEach(id => result.push(state.appointments[id]));

  return result;
}

export function getInterview(state, interview) {
  if (interview === null) return null;
  let id = interview.interviewer;
  let result = {...interview, interviewer: state.interviewers[id]}

  return result;
}

export function getInterviewersForDay(state, day) {
  let result = [];
  console.log(state.days)
  const findDay = () => state.days.filter(i => i.name === day)
  const days = findDay()
  if (days.length === 0) return result;
  const interviewersFound = days[0].interviewers
  interviewersFound.forEach(id => result.push(state.interviewers[id]));

  return result;
}
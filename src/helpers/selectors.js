export function getInterview(state, interview) {
  if (interview === null) return null;
  const id = interview.interviewer;
  let result = {...interview, interviewer: state.interviewers[id]}

  return result;
}

// the following function has been refactored from two very similar functions - 'getInterviewersForDay' and 'getAppointmentsForDay'
// now, by feeding an info string whenever this function is called, it has been made to be more modularized
// given a day, it returns either the interviewers array of objects or appointments array of objects for that given day

export function getInfoForDay(state, day, info) {
  let result = [];
  const findDay = () => state.days.filter(i => i.name === day)
  const days = findDay()
  if (days.length === 0) return result;
  const found = days[0][info]
  found.forEach(id => result.push(state[info][id]));

  return result;
}

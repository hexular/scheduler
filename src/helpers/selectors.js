export function getInterview(state, interview) {
  if (interview === null) return null;
  const id = interview.interviewer;
  let result = {...interview, interviewer: state.interviewers[id]}

  return result;
}

export function getInfoForDay(state, day, info) {
  let result = [];
  const findDay = () => state.days.filter(i => i.name === day)
  const days = findDay()
  if (days.length === 0) return result;
  const found = days[0][info]
  found.forEach(id => result.push(state[info][id]));

  return result;
}

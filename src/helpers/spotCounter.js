import { getInfoForDay } from "./selectors";

export default function spotCounter(state, days) {
  
  let result = []
  days.forEach(day => {
    result.push(getInfoForDay(state, day.name, 'appointments')
      .map(item => item.interview !== null ? 0 : 1)
      .reduce((total, val) => total + val))
  })
  return result;
}
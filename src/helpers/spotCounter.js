import { getAppointmentsForDay } from "./selectors";

export default function spotCounter(state, days) {
  
  // console.log(getAppointmentsForDay(state, days[0].name))
  let result = []
  days.forEach(day => {
    result.push(getAppointmentsForDay(state, day.name)
      .map(item => item.interview !== null ? 0 : 1)
      .reduce((total, val) => total + val))
  })
  return result;
}
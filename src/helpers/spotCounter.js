import { getAppointmentsForDay } from "./selectors";

export default function spotCounter(state, days) {
  
  console.log(getAppointmentsForDay(state, days[0].name))

  days.forEach(day => {
    console.log(getAppointmentsForDay(state, day.name)
      .map(item => item.interview !== null ? 1 : 0)
      .reduce((total, val) => total + val))
  })

}
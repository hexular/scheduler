import { getInfoForDay } from "./selectors";

// This helper function is responsible for counting the spots for every day given a state and an array of day objects (days)
// it first finds the appointments for each day (using the getInfoForDay helper function with an appointments info input), and pushes them to the results empty array
// it then maps each appointment's interview value to either 0 if booked or 1 if it's empty
// finally, it reduces this large array of every day's empty interview slots to a combined number, resulting in a 5 item array of numbers like so:
//  e.g. [1, 2, 3, 4, 5] with each index corresponding to the available spots in the days of the week starting with Monday
// this function is then used within the reducer

export default function spotCounter(state, days) {
  
  let result = []
  days.forEach(day => {
    result.push(getInfoForDay(state, day.name, 'appointments')
      .map(item => item.interview !== null ? 0 : 1)
      .reduce((total, val) => total + val))
  })
  return result;
}
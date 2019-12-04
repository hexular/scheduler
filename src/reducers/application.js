import spotCounter from "../helpers/spotCounter";

export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

// custom reducer hook responsible for managing state and setting up the initial state
// while most cases are obvious, the SET_INTERVIEW case is worth elaborating:
// the case is only called upon recieving data from the websocket connection which means rendering is never done unless websocket data is recieved
// once new data to be rendered is recived, the spots for each day are calculated based on the new appointments state
// while it may seem inefficient to recalculate every single day's spots, it ensures that if two concurrent clients are looking at two different days
// the spots will be updated for the days they are not looking at as well

export default function reducer(state, action) {

  switch (action.type) {
    case SET_APPLICATION_DATA:
      return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
    case SET_DAY:
      return { ...state, day: action.day } 
    case SET_INTERVIEW: 
      const appointment = {
        ...state.appointments[action.id],
        interview: (action.interview ? { ...action.interview } : null)
      };
      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };
      const newSpots = spotCounter({ ...state, appointments} , state.days)
      newSpots.map((spot, index) => state.days[index].spots = spot)
      
      return { ...state, id: action.id, appointments: appointments }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}
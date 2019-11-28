import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

const initialState = {
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
};

function reducer(state, action) {

  switch (action.type) {
    case SET_APPLICATION_DATA:
      return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
    case SET_DAY:
      return { ...state, day: action.day } 
    case SET_INTERVIEW: 
      console.log(state)
      state.days.forEach(item => item.name === state.day && console.log(item.spots))
      return { ...state, id: action.id, appointments: action.appointments, days: action.days }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, initialState);

  async function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const days = [
      ...state.days,
    ];
    days.forEach(item => item.name === state.day && item.spots--)
    await axios.put(`/api/appointments/${id}`, {interview})
      .then(() => dispatch({ type: SET_INTERVIEW, id, appointments, days }))
  }

  async function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const days = [
      ...state.days,
    ];
    days.forEach(item => item.name === state.day && item.spots++)
    await axios.delete(`/api/appointments/${id}`)
      .then(() => dispatch({type: SET_INTERVIEW, id, appointments, days }))
  }

  const setDay = day => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    Promise.all([
      axios.get(`api/days`),
      axios.get(`api/appointments`),
      axios.get(`api/interviewers`)
    ]).then((all) => {
      dispatch(
        {type: SET_APPLICATION_DATA, 
          days: all[0].data, 
          appointments: all[1].data, 
          interviewers: all[2].data
        })
    });
  }, []);

  return {
    cancelInterview,
    bookInterview,
    state,
    setDay
  };

}
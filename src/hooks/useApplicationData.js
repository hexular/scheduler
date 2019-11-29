import { useEffect, useReducer } from "react";
import axios from "axios";
import spotCounter from "../helpers/spotCounter"

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
      const appointment = {
        ...state.appointments[action.id],
        interview: (action.interview ? { ...action.interview } : null)
      };
      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };
      spotCounter({ ...state, appointments} , state.days)
      console.log(action)
      // const days = [
      //   ...state.days,
      // ];
      // console.log(state.appointments[action.id].interview)
      // days.forEach(item => { 
      //   if (item.name === state.day) { 
      //     action.change < 0 ? 
      //       state.appointments[action.id].interview === null && (item.spots += action.change) : 
      //       item.spots += action.change;
      //   }
      // });
      // console.log(state)
      // console.log(days)
      // state.days.forEach(item => item.name === state.day && console.log(item.spots))
      return { ...state, id: action.id, appointments: appointments }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
      
  }
}

// take client recieved object and update appointments using the interview it provides, then dispatch set inteveriew...

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state)
  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, {interview})
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
  }

  const setDay = day => dispatch({ type: SET_DAY, day });

  useEffect(() => {

    const socket = new WebSocket('ws://localhost:8001');
    socket.addEventListener('open', () => {
      console.log('connected to server');
      socket.send('ping')
      // dispatch({ type: "SET_SOCKET", value: socket })
    });

    socket.onmessage = msg => {
      // console.log("msg", msg.data);
      const data = JSON.parse(msg.data);
      console.log(typeof data)
      // typeof data === 'object' &&
      // (data.interview === null ? data.change = 1 : data.change = -1)
      // console.log(data);
      data.type === "SET_INTERVIEW" && dispatch({ ...data });
    };

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
    })
    return () => {
      socket.close();
    }
  }, []);

  return {
    cancelInterview,
    bookInterview,
    state,
    setDay
  };

}
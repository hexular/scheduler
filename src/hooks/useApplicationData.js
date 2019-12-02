import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "../reducers/application.js";

// const SET_DAY = "SET_DAY";
// const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
// const SET_INTERVIEW = "SET_INTERVIEW";

const initialState = {
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
};

// function reducer(state, action) {

//   switch (action.type) {
//     case SET_APPLICATION_DATA:
//       return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
//     case SET_DAY:
//       return { ...state, day: action.day } 
//     case SET_INTERVIEW: 
//       const appointment = {
//         ...state.appointments[action.id],
//         interview: (action.interview ? { ...action.interview } : null)
//       };
//       const appointments = {
//         ...state.appointments,
//         [action.id]: appointment
//       };
//       const newSpots = spotCounter({ ...state, appointments} , state.days)
//       newSpots.map((spot, index) => state.days[index].spots = spot)
      
//       return { ...state, id: action.id, appointments: appointments }
//     default:
//       throw new Error(
//         `Tried to reduce with unsupported action type: ${action.type}`
//       );
//   }
// }

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, initialState);

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, {interview})
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
  }

  const setDay = day => dispatch({ type: SET_DAY, day });

  useEffect(() => {

    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    socket.addEventListener('open', () => {

      console.log('connected to server');

      socket.send('ping')

    });

    socket.onmessage = msg => {

      const data = JSON.parse(msg.data);

      data.type === SET_INTERVIEW && dispatch({ ...data });

    };

    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`)
    ]).then((all) => {
      dispatch(
        {type: SET_APPLICATION_DATA, 
          days: all[0].data, 
          appointments: all[1].data, 
          interviewers: all[2].data
        })
    })
    return () => socket.close();
    
    
  }, []);

  return {
    cancelInterview,
    bookInterview,
    state,
    setDay
  };

}
import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_SOCKET = "SET_SOCKET";

const initialState = {
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
};

function reducer(state, action) {

  // const sendAppointment = newApp => {
  //   if (state.socket && !action.fromRemote) {
  //     state.socket.send(JSON.stringify(newApp));
  //   }
  // };

  switch (action.type) {
    // case SET_SOCKET:
    //   return { ...state, socket: action.value }
    case SET_APPLICATION_DATA:
      return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
    case SET_DAY:
      return { ...state, day: action.day } 
    case SET_INTERVIEW: 
      // sendAppointment({ id: action.id, appointments: action.appointments, days: action.days })
      const appointment = {
        ...state.appointments[action.id],
        interview: (action.interview ? { ...action.interview } : null)
      };
      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };
      const days = [
        ...state.days,
      ];
      // DO NOT CHANGE item.spots IF INTERVIEW EXISTED ANNDDDDDDD action.change IS < 0 !!!!!!!!!!!!!!
      console.log(state.appointments[action.id].interview)
      days.forEach(item => { 
        if (item.name === state.day) { 
          action.change < 0 ? 
            state.appointments[action.id].interview === null && (item.spots += action.change) : 
            item.spots += action.change
        }
      });
      console.log(state)
      console.log(days)
      state.days.forEach(item => item.name === state.day && console.log(item.spots))
      return { ...state, id: action.id, appointments: appointments, days: days }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
      
  }
}

// take client recieved object and update appointments using the interview it provides, then dispatch set inteveriew...

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, initialState);

  async function bookInterview(id, interview) {
    // const appointment = {
    //   ...state.appointments[id],
    //   interview: { ...interview }
    // };
    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // };
    // const days = [
    //   ...state.days,
    // ];
    // days.forEach(item => item.name === state.day && !state.appointments[id].interview && item.spots--)
    await axios.put(`/api/appointments/${id}`, {interview})
      .then(() => dispatch({ type: SET_INTERVIEW, id, change: -1, interview }))
  }

  async function cancelInterview(id) {
    // const appointment = {
    //   ...state.appointments[id],
    //   interview: null
    // };
    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // };
    // const days = [
    //   ...state.days,
    // ];
    // days.forEach(item => item.name === state.day && item.spots++)
    // console.log('days here', days)
    await axios.delete(`/api/appointments/${id}`)
      .then(() => dispatch({type: SET_INTERVIEW, id, change: 1, interview: null }))
  }

  const setDay = day => dispatch({ type: SET_DAY, day });

  useEffect(() => {

    // const socket = new WebSocket('ws://localhost:8001');
    // socket.addEventListener('open', () => {
    //   console.log('connected to server');
    //   socket.send('ping')
    //   dispatch({ type: "SET_SOCKET", value: socket })
    // });

    // socket.addEventListener("message", msg => {
    //   // console.log("msg", msg.data);
    //   const data = JSON.parse(msg.data);
    //   console.log(data)
    //   data.type === "SET_INTERVIEW" && dispatch({ ...data, fromRemote: true });
    // });

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
    // return () => {
    //   socket.close();
    // }
  }, []);

  return {
    cancelInterview,
    bookInterview,
    state,
    setDay
  };

}
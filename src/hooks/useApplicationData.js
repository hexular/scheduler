import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "../reducers/application.js";

const initialState = {
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
};

// this function is responsible for all api calls and setting the state given data from api calls or socket connections
// the function has been set up to connect to the server via a websocket connection, and upon recieving data from the server
// send it to the reducer to be rendered locally

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
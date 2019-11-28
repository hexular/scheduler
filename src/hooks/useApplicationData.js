import { useEffect, useState } from "react";
import axios from "axios";


export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  async function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    await axios.put(`/api/appointments/${id}`, {interview})
      .then(() => setState({...state, appointments}))
  }

  async function cancelInterview(id) {
    await axios.delete(`/api/appointments/${id}`)
      .then(() => setState({...state}))
  }

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get(`api/days`),
      axios.get(`api/appointments`),
      axios.get(`api/interviewers`)
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    });
  }, []);

  return {
    cancelInterview,
    bookInterview,
    state,
    setDay
  };

}
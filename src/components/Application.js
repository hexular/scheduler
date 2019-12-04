import React from "react";

import { getInfoForDay } from "../helpers/selectors.js"
import { getInterview } from "../helpers/selectors.js"
import "components/Application.scss";
import DayList from "components/DayList.js";
import Appointment from "components/Appointment"
import useApplicationData from "../hooks/useApplicationData"

export default function Application() {

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  const intervs = getInfoForDay(state, state.day, 'interviewers')
  
  const apps = getInfoForDay(state, state.day, 'appointments')

  const app = apps.map(appointment => {
    const intervieww = getInterview(state, appointment.interview);
    
    return (
      <Appointment 
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={intervieww}
        interviewers={intervs}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    )
  })

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            key={state.day.id}
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {app}
        <Appointment 
          key="last" 
          time="5pm"
        />
      </section>
    </main>
  );
}

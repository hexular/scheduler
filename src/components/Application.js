import React, {useState, useEffect} from "react";
import axios from 'axios';

import { getAppointmentsForDay } from "../helpers/selectors.js"
import { getInterview } from "../helpers/selectors.js"
import "components/Application.scss";
import DayList from "components/DayList.js";
import Appointment from "components/Appointment"
import { getInterviewersForDay } from "../helpers/selectors";
import useApplicationData from "../hooks/useApplicationData"
// import DayListItem from "components/DayListItem.js";
// import Button from "components/Button.js";

export default function Application() {

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  

  const intervs = getInterviewersForDay(state, state.day)
  
  const apps = getAppointmentsForDay(state, state.day)
  

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
      </section>
    </main>
  );
}

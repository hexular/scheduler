import React from "react";
import "./style.scss";
import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "components/Appointment/Form";
import useVisualMode from "../../hooks/useVisualMode"


export default function Appointment(props) {
console.log(props.interviewers)
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";

function save(name, interviewer) {
  const interview = {
    student: name,
    interviewer
  };
  props.bookInterview(props.id, interview)
}

const { mode, transition, back } = useVisualMode(
  props.interview ? SHOW : EMPTY
)

  return (
    <article className="appointment">
      <Header time={props.time} key={props.id} />

        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}

        {mode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
          />
        )}

        {mode === CREATE && (
          <Form 
            interviewers={props.interviewers}
            onCancel={back}
            onSave={save}
          />)
        }
       
        
    </article>
  );
}


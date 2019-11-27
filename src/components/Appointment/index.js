import React from "react";
import "./style.scss";
import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import useVisualMode from "../../hooks/useVisualMode"


export default function Appointment(props) {

const SAVING = "SAVING";
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const DELETING = "DELETING";
const CONFIRM = 'CONFIRM';

function save(name, interviewer) {
  const interview = {
    student: name,
    interviewer
  };
  transition(SAVING);
  props.bookInterview(props.id, interview)
    .then(() => transition(SHOW));
}

function trash() {
  transition(DELETING, true);
  props.cancelInterview(props.id)
    .then(() => transition(EMPTY));
}

function cancel() {
  transition(CONFIRM)
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
            onDelete={cancel}
          />
        )}

        {mode === CREATE && (
          <Form 
            interviewers={props.interviewers}
            onCancel={back}
            onSave={save}
          />)
        }

        {mode === SAVING && (
          <Status message={'Saving interview'}/>
        )}

        {mode === DELETING && (
          <Status message={'Cancelling interview'}/>
        )}
       
        {mode === CONFIRM && (
          <Confirm onCancel={back} onConfirm={trash} message={"Press confirm to remove this interview"}/>
        )}
        
        
    </article>
  );
}


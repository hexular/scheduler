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
  console.log('trashed')
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
            onDelete={() => transition(CONFIRM)}
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
          <Status message={'Saving'}/>
        )}
       
        {mode === CONFIRM && (
          <Confirm onCancel={back()} onConfirm={trash()} message={"Are you sure you want to cancel the interview?"}/>
        )}
        
    </article>
  );
}


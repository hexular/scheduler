import React from "react";
import "./style.scss";
import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "components/Appointment/Form";
import Error from "components/Appointment/Error";
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
const EDIT = 'EDIT';
const ERROR_SAVE = 'ERROR_SAVE';
const ERROR_DELETE = 'ERROR_DELETE';

function save(name, interviewer) {
  const interview = {
    student: name,
    interviewer
  };
  transition(SAVING);
  props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch(() => transition(ERROR_SAVE, true));
};

function trash() {
  transition(DELETING, true);
  props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(() => transition(ERROR_DELETE, true));
};

function cancel() {
  transition(CONFIRM)
};

function edit() {
  transition(EDIT)
};

const { mode, transition, back } = useVisualMode(
  props.interview ? SHOW : EMPTY
);
  console.log(props)
  return (
    <article className="appointment">
      <Header time={props.time} key={props.id} />

        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}

        {mode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            onDelete={cancel}
            onEdit={edit}
          />
        )}

        {mode === CREATE && (
          <Form 
            // name={props.interview.student}
            interviewers={props.interviewers}
            // interviewer={props.interview.interviewer}
            onCancel={back}
            onSave={save}
          />)
        }

        {mode === EDIT && (
          <Form 
          name={props.interview.student}
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id}
          onCancel={back}
          onSave={save}
          />
        )}

        {mode === SAVING && (
          <Status message={'Saving interview'} />
        )}

        {mode === DELETING && (
          <Status message={'Cancelling interview'} />
        )}
       
        {mode === CONFIRM && (
          <Confirm onCancel={back} onConfirm={trash} message={"Press confirm to remove this interview"}/ >
        )}

        {mode === ERROR_DELETE && (
          <Error message={'Could not cancel appointment'} onClose={back} />
        )}

        {mode === ERROR_SAVE && (
          <Error message={'Could not book appointment'} onClose={back} />
        )}
        
    </article>
  );
};


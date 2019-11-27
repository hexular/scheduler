import {useState} from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([]);

  function transition(newMode, replace = false) {
    !replace && history.push(mode);
    setMode(newMode);
  }

  function back() {
    history.length === 0 ? setMode(mode) :
    setMode(history[history.length - 1])
    history.pop()
  }

  return { mode, transition, back };
}
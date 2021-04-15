import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace) => {
    setMode(newMode);
    push(newMode, replace);
  };

  const back = () => {
    if (history.length > 1) {
      setMode(pop());
    }
  };

  const push = (mode, replace) => {
    const tmpHist = replace ? history.slice(0, -1) : history;
    setHistory([...tmpHist, mode]);
  };

  const pop = () => {
    setHistory([...history.slice(0, -1)]);
    return history.slice(-2)[0];
  };

  return { mode, transition, back };
}

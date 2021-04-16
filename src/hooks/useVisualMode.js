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
    setHistory((prev) => {
      const hist = replace ? prev.slice(0, -1) : prev;
      return [...hist, mode];
    });
  };

  const pop = () => {
    setHistory((prev) => [...prev.slice(0, -1)]);
    return history.slice(-2)[0];
  };

  return { mode, transition, back };
}

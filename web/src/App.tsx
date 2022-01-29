import React, { useEffect, useState } from "react";
import Action from "./components/shared/Action";
import Card from "./components/shared/Card";

type Window = {
  seed: "conglomerate" | "empl" | "forest";
  isOpen: boolean;
};

const App: React.FC = () => {
  const [count, setCount] = useState(2);
  const [persons, setPersons] = useState<Window[]>([]);
  const [targets, setTargets] = useState<boolean[]>([]);

  useEffect(() => {
    const res = Array(5)
      .fill(0)
      .map(() => Math.floor(Math.random() * 3) + 1)
      .map((i) => (i == 1 ? "conglomerate" : i == 2 ? "empl" : "forest"))
      .map((seed): Window => ({ seed, isOpen: true }));
    setPersons(res);
    setTargets(res.map(() => false));
    /* eslint-disable */
  }, []);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-slate-800">
      <span className="absolute top-5 right-6 text-2xl font-mono text-slate-600">
        {count}
      </span>
      <div className="flex items-center justify-center flex-row">
        {persons.map(({ seed, isOpen }, i) => (
          <div
            className="active:scale-90 mx-1"
            key={i}
            onClick={() => {
              setTargets((prev) =>
                prev.map((bool, j) => {
                  if (j !== i || (count == 0 && !bool)) return bool;
                  setCount((prev) => prev + (bool ? +1 : -1));
                  return !bool;
                })
              );
            }}
          >
            <Card seed={isOpen ? seed : undefined} isTargeted={targets[i]} />
          </div>
        ))}
      </div>
      <div className="absolute bottom-6 flex items-center justify-center">
        <Action action="Target" />
        <Action action="Target" />
        <Action action="Target" />
      </div>
    </div>
  );
};

export default App;

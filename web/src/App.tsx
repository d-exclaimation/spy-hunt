import React, { useEffect, useState } from "react";
import Card from "./components/shared/Card";

type Window = {
  seed: "conglomerate" | "empl" | "forest";
  isOpen: boolean;
};

const App: React.FC = () => {
  const [persons, setPersons] = useState<Window[]>([]);
  const [targets, setTargets] = useState<boolean[]>([]);

  useEffect(() => {
    const res = Array(5)
      .fill(0)
      .map(() => Math.floor(Math.random() * 3) + 1)
      .map((i) => (i == 1 ? "conglomerate" : i == 2 ? "empl" : "forest"))
      .map((seed): Window => ({ seed, isOpen: true }));
    setPersons(res);
    setTargets(res.map(() => Math.random() < 0.45));
    /* eslint-disable */
  }, []);

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="flex items-center justify-center flex-row">
        {persons.map(({ seed, isOpen }, i) => (
          <div
            className="active:scale-90"
            key={i}
            onClick={() =>
              setTargets((prev) =>
                prev.map((bool, j) => (j == i ? !bool : bool))
              )
            }
          >
            <Card seed={isOpen ? seed : undefined} isTargeted={targets[i]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

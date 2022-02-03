import React, { useState } from "react";
import Card from "./components/shared/Card";
import { useHunt } from "./state/useHunt";

const App: React.FC = () => {
  const { state, lockOn, fire, next, call, allies, foes } = useHunt();
  const [currentAction, setAction] = useState<"lock" | "fire" | "call" | null>(
    null
  );

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-slate-800">
      <div className="absolute top-5 left-5 font-mono text-blue-400">
        Allies: {allies}
      </div>
      <div className="absolute top-5 right-5 font-mono text-red-400">
        Foes: {foes}
      </div>
      <div className="flex items-center justify-center flex-row">
        {state.map(({ team, isOpen, isTargeted }, i) => {
          return (
            <div
              className="active:scale-90 mx-1"
              key={i}
              onClick={() => {
                setAction((prev) => {
                  if (!prev) return null;
                  switch (prev) {
                    case "lock":
                      lockOn(i);
                      break;
                    case "fire":
                      fire(i);
                      break;
                    case "call":
                      call(i);
                      break;
                  }
                  return null;
                });
              }}
            >
              <Card seed={isOpen ? team : undefined} isTargeted={isTargeted} />
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-6 flex items-center justify-center">
        <div
          className={`flex flex-col items-center justify-center w-32 h-16 mx-1 ${
            currentAction !== "fire" ? "bg-violet-300" : "bg-lime-200"
          } rounded-lg shadow-lg select-none active:scale-90`}
          onClick={() => setAction("fire")}
        >
          <div className="font-mono text-white text-3xl">🚀</div>
        </div>
        <div
          className={`flex flex-col items-center justify-center w-32 h-16 mx-1 ${
            currentAction !== "lock" ? "bg-blue-300" : "bg-lime-200"
          } rounded-lg shadow-lg select-none active:scale-90`}
          onClick={() => setAction("lock")}
        >
          <div className="font-mono text-white text-3xl">🔭</div>
        </div>
        <div
          className={`flex flex-col items-center justify-center w-32 h-16 mx-1 ${
            currentAction !== "call" ? "bg-emerald-300" : "bg-lime-200"
          } rounded-lg shadow-lg select-none active:scale-90`}
          onClick={() => setAction("call")}
        >
          <div className="font-mono text-white text-3xl">📞</div>
        </div>
        <div className="flex flex-col items-center justify-center w-32 h-16 mx-1 bg-red-300 rounded-lg shadow-lg select-none active:scale-90">
          <div className="font-mono text-white text-3xl">🚨</div>
        </div>
      </div>
    </div>
  );
};

export default App;

import React, { useCallback, useState } from "react";
import Action from "./components/shared/Action";
import Targets from "./components/Targets";
import Uppers from "./components/Uppers";
import WindowView from "./components/WindowView";
import { ActionCard } from "./state/useAction";
import { useHunt } from "./state/useHunt";

const App: React.FC = () => {
  const { state, lockOn, fire, next, call, allies, foes, shutter } = useHunt();
  const [currentAction, setAction] = useState<"lock" | "fire" | "call" | null>(
    null
  );

  const onClickWindow = useCallback(
    (i: number) => {
      if (!currentAction) return;
      switch (currentAction) {
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
      setAction(null);
    },
    [setAction, currentAction, fire, call, lockOn]
  );

  const action = useCallback(
    (type: ActionCard["type"]) => {
      if (type === "next") {
        next();
        return;
      }

      if (type === "close") {
        shutter();
        return;
      }

      setAction(type);
    },
    [next, shutter, setAction]
  );

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-slate-800">
      <div className="absolute top-5 left-5 font-mono text-blue-400">
        Allies: {allies}
      </div>
      <div className="absolute top-5 right-5 font-mono text-red-400">
        Foes: {foes}
      </div>
      <div className="flex items-center justify-center flex-col">
        <Uppers />
        <WindowView state={state} onClickWindow={onClickWindow} />
        <Targets state={state} onClickWindow={onClickWindow} />
      </div>
      <div className="absolute bottom-6 flex items-center justify-center">
        <Action
          currentAction={currentAction}
          type="fire"
          action={action}
          color="bg-violet-300"
          icon="🚀"
        />
        <Action
          currentAction={currentAction}
          type="lock"
          action={action}
          color="bg-blue-300"
          icon="🔭"
        />
        <Action
          currentAction={currentAction}
          type="call"
          action={action}
          color="bg-emerald-300"
          icon="📞"
        />
        <Action
          currentAction={currentAction}
          type="next"
          action={action}
          color="bg-red-300"
          icon="🚨"
        />
      </div>
    </div>
  );
};

export default App;

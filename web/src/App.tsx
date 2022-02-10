import React, { useCallback, useEffect, useState } from "react";
import ActionView from "./components/ActionView";
import Targets from "./components/Targets";
import Uppers from "./components/Uppers";
import WindowView from "./components/WindowView";
import { ActionCard, ActiveAction, useAction } from "./state/useAction";
import { useHunt } from "./state/useHunt";

const App: React.FC = () => {
  const { use, playerHand, refill } = useAction();
  const { state, lockOn, fire, next, call, allies, foes, shutter } = useHunt();
  const [currentAction, setAction] = useState<ActiveAction | null>(null);

  useEffect(() => {
    if (playerHand.length > 3) return;
    refill();
  }, [playerHand]);

  const onClickWindow = useCallback(
    (i: number) => {
      if (!currentAction) return;
      const { type, index } = currentAction;
      switch (type) {
        case "lock":
          lockOn(i);
          break;
        case "fire":
          fire(i);
          break;
        case "call":
          call(i);
          break;
        case "close":
          shutter();
          break;
        case "next":
          next();
          break;
      }
      use(index);
      setAction(null);
    },
    [setAction, currentAction, fire, call, lockOn]
  );

  const action = useCallback(
    (index: number) => {
      return (type: ActionCard["type"], key: string) => {
        setAction({ type, key, index });
      };
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
        <ActionView
          currentAction={currentAction}
          playerHand={playerHand}
          action={action}
        />
      </div>
    </div>
  );
};

export default App;

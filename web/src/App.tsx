import React, { useCallback, useEffect, useState } from "react";
import ActionView from "./components/ActionView";
import Targets from "./components/Targets";
import Uppers from "./components/Uppers";
import WindowView from "./components/WindowView";
import { ActionCard, ActiveAction, useAction } from "./state/useAction";
import { useHunt } from "./state/useHunt";

const App: React.FC = () => {
  const [isMyTurn, setTurn] = useState(true);
  const [isEnemyDone, setEnemyDone] = useState(false);
  const { use, playerHand, refill } = useAction();
  const { state, lockOn, fire, next, call, allies, foes, shutter, cpu } =
    useHunt();
  const [currentAction, setAction] = useState<ActiveAction | null>(null);

  useEffect(() => {
    if (playerHand.length > 3) return;
    setTurn(false);
    cpu();
    setTimeout(() => setEnemyDone(true), 1000);
  }, [playerHand]);

  useEffect(() => {
    if (!isEnemyDone) return;
    next();
    refill();
    setTurn(true);
    setEnemyDone(false);
  }, [isEnemyDone]);

  const onClickWindow = useCallback(
    (i: number) => {
      if (!currentAction || !isMyTurn) return;
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
    [setAction, currentAction, fire, call, lockOn, isMyTurn]
  );

  const action = useCallback(
    (index: number) => {
      return (type: ActionCard["type"], key: string) => {
        if (!isMyTurn) return;
        setAction({ type, key, index });
      };
    },
    [next, shutter, setAction, isMyTurn]
  );

  if (allies === 0) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-red-400 text-slate-800 font-mono text-lg">
        You lose
      </div>
    );
  }

  if (foes === 0) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-emerald-400 text-slate-800 font-mono text-lg">
        You win
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center w-screen h-screen ${
        isMyTurn ? "bg-slate-800" : "bg-red-900"
      }`}
    >
      <div className="absolute top-5 left-5 font-mono text-emerald-300">
        Allies: {allies}
      </div>
      <div className="absolute top-5 font-mono text-slate-200">
        {isMyTurn ? "Your turn" : "Enemy turn"}
      </div>
      <div className="absolute top-5 right-5 font-mono text-red-300">
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

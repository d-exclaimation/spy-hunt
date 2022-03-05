import React, { useCallback, useEffect, useState } from "react";
import ActionView from "./components/ActionView";
import Targets from "./components/Targets";
import Uppers from "./components/Uppers";
import WindowView from "./components/WindowView";
import { ActionCard, ActiveAction, useAction } from "./state/useAction";
import { useMultiHunt } from "./state/useMultiHunt";
import { match } from "./utils/match";

const App: React.FC = () => {
  const { use, playerHand, refill } = useAction();
  const { state, lockOn, fire, next, call, allies, foes, shutter, isTurn } =
    useMultiHunt();
  const [currentAction, setAction] = useState<ActiveAction | null>(null);

  useEffect(() => {
    if (playerHand.length > 3) return;
    refill();
  }, [playerHand]);

  const onClickWindow = useCallback(
    (i: number) => {
      if (!currentAction || !isTurn) return;
      const { type, index } = currentAction;
      match(type, {
        lock: () => lockOn(i),
        fire: () => fire(i),
        call: () => call(i),
        close: () => shutter(),
        next: () => next(),
      });
      use(index);
      setAction(null);
    },
    [setAction, currentAction, fire, call, lockOn, isTurn]
  );

  const action = useCallback(
    (index: number) => {
      return (type: ActionCard["type"], key: string) => {
        if (!isTurn) return;
        setAction({ type, key, index });
      };
    },
    [next, shutter, setAction, isTurn]
  );

  if (state.length == 0) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-blue-400 text-slate-800 font-mono text-lg">
        Matchmaking...
      </div>
    );
  }

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
        isTurn ? "bg-slate-800" : "bg-red-900"
      }`}
    >
      <div className="absolute top-5 left-5 font-mono text-emerald-300">
        Allies: {allies}
      </div>
      <div className="absolute top-5 font-mono text-slate-200">
        {isTurn ? "Your turn" : "Enemy turn"}
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

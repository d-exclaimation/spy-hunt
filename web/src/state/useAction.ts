//
//  useAction.ts
//  web
//
//  Created by d-exclaimation on 16:25.
//
import { useCallback, useState } from "react";
import { v4 } from "uuid";

export type ActionCard = {
  key: string;
  type: "lock" | "fire" | "call" | "next" | "close";
  color: string;
  icon: string;
};

export type ActiveAction = {
  type: ActionCard["type"];
  key: string;
  index: number;
};

export function useAction() {
  const [playerHand, setPlayerHand] = useState<ActionCard[]>(
    Array(5)
      .fill(0)
      .map(() => randomCard())
  );

  const use = useCallback(
    (i: number) => {
      setPlayerHand((hand) => hand.filter((_, j) => j !== i));
    },
    [setPlayerHand]
  );

  const refill = useCallback(
    () => setPlayerHand((curr) => [randomCard(), randomCard(), ...curr]),
    [setPlayerHand]
  );

  return { playerHand, use, refill };
}

export function randomCard(): ActionCard {
  const chances = Math.random();

  const res = ((): Omit<ActionCard, "key"> => {
    if (chances < 0.025) {
      return {
        type: "close",
        color: "bg-yellow-300",
        icon: "🪟",
      };
    } else if (chances < 0.075) {
      return {
        type: "next",
        color: "bg-red-300",
        icon: "🚨",
      };
    } else if (chances < 0.2) {
      return {
        type: "call",
        color: "bg-emerald-300",
        icon: "📞",
      };
    } else if (chances < 0.6) {
      return {
        type: "fire",
        color: "bg-violet-300",
        icon: "🚀",
      };
    } else {
      return {
        type: "lock",
        color: "bg-blue-300",
        icon: "🔭",
      };
    }
  })();

  return { ...res, key: v4() };
}

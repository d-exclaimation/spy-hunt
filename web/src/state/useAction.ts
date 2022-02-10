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

function randomCard(): ActionCard {
  const i = Math.floor(Math.random() * 5);
  const cardTypes: { [key: number]: Omit<ActionCard, "key"> } = {
    0: {
      type: "fire",
      color: "bg-violet-300",
      icon: "🚀",
    },
    1: {
      type: "lock",
      color: "bg-blue-300",
      icon: "🔭",
    },
    2: {
      type: "call",
      color: "bg-emerald-300",
      icon: "📞",
    },
    3: {
      type: "next",
      color: "bg-red-300",
      icon: "🚨",
    },
    4: {
      type: "close",
      color: "bg-yellow-300",
      icon: "🪟",
    },
  };

  return { ...cardTypes[i], key: v4() };
}

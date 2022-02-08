//
//  useAction.ts
//  web
//
//  Created by d-exclaimation on 16:25.
//
import { useEffect, useState } from "react";

export type ActionCard = {
  type: "lock" | "fire" | "call" | "next" | "close";
  color: string;
  icon: string;
};

export function useAction() {
  const [playerHand, setPlayerHand] = useState<ActionCard[]>([]);

  useEffect(() => {
    const hand = Array(5)
      .fill(0)
      .map(() => randomCard());
    setPlayerHand(hand);
  }, []);

  return playerHand;
}

function randomCard(): ActionCard {
  const i = Math.floor(Math.random() * 5);
  const cardTypes: { [key: number]: ActionCard } = {
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

  return cardTypes[i];
}

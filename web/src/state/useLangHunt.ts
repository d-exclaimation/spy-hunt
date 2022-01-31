//
//  useLangHunt.ts
//  web
//
//  Created by d-exclaimation on 16:36.
//
import { useCallback, useEffect, useState } from "react";
import { shuffled } from "./../utils/shuffle";

const PLACEHOLDER: Record<number, string> = {
  0: "conglomerate",
  1: "empl",
  2: "forest",
};

type Agent = {
  team: string;
};

type Window = {
  isOpen: boolean;
  isTargeted: boolean;
};

export function useLangHunt() {
  const [deck, setDeck] = useState<string[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [windows, setWindows] = useState<Window[]>([]);

  useEffect(() => {
    const team0 = Array(20).fill(PLACEHOLDER[0]);
    const team1 = Array(20).fill(PLACEHOLDER[1]);
    const team2 = Array(20).fill(PLACEHOLDER[2]);
    const [first, second, third, fourth, fifth, ...remains] = shuffled([
      ...team0,
      ...team1,
      ...team2,
    ]);

    setDeck(remains);
    setAgents(
      [first, second, third, fourth, fifth].map((team) => ({
        team,
      }))
    );
    setWindows(
      Array(5)
        .fill(false)
        .map(() => ({ isOpen: true, isTargeted: false }))
    );
    /* eslint-ignore */
  }, []);

  const forwardProgress = useCallback(() => {
    setAgents((prev) => {
      const [removed, ...stays] = prev.reverse();
      const [next, ...remains] = deck;
      setDeck([...remains, removed.team]);

      return [...stays, { team: next }].reverse();
    });
  }, [deck, agents, setDeck, setAgents]);

  const targetWindow = useCallback(
    (i: number) => {
      setWindows((windows) =>
        windows.map((prev, j) => ({
          ...prev,
          isTargeted: i == j ? true : prev.isTargeted,
        }))
      );
    },
    [setWindows]
  );

  const shotWindow = useCallback(
    (i: number) => {
      if (!windows[i].isTargeted) return;

      // Remove marking
      setWindows((previousWindows) =>
        previousWindows.map((prev, j) => ({
          ...prev,
          isTargeted: i == j ? false : prev.isTargeted,
        }))
      );

      // Remove agent
      setAgents((prev) => {
        const left = prev.filter((_, j) => i != j);
        const [next, ...remains] = deck;
        setDeck(remains);
        return [{ team: next }, ...left];
      });
    },
    [setAgents, setWindows, setDeck, windows, deck]
  );

  return {
    agents,
    windows,
    forwardProgress,
    targetWindow,
    shotWindow,
  };
}

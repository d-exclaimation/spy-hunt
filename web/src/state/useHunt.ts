//
//  useLangHunt.ts
//  web
//
//  Created by d-exclaimation on 16:36.
//
import { useCallback, useEffect, useMemo, useState } from "react";
import { shuffled } from "../utils/shuffle";

const PLACEHOLDER: Record<number, string> = {
  0: "forest",
  1: "conglomerate",
  2: "empl",
};

type Window = {
  isOpen: boolean;
  isTargeted: boolean;
};

export function useHunt() {
  // MARK: --- States ---

  const [deck, setDeck] = useState<string[]>([]);
  const [queue, setQueue] = useState<string[]>([]);
  const [windows, setWindows] = useState<Window[]>([]);

  const state = useMemo(
    () => queue.map((team, i) => ({ team, ...windows[i] })),
    [queue, windows]
  );

  const allies = useMemo(
    () => [...deck, ...queue].filter((team) => team === PLACEHOLDER[1]).length,
    [deck, queue]
  );

  const foes = useMemo(
    () => [...deck, ...queue].filter((team) => team === PLACEHOLDER[1]).length,
    [deck, queue]
  );

  /**
   * Initial State
   */
  useEffect(() => {
    const [_0, _1, _2, _3, _4, ...initial] = shuffled([
      ...Array(20).fill(PLACEHOLDER[0]),
      ...Array(20).fill(PLACEHOLDER[1]),
      ...Array(20).fill(PLACEHOLDER[2]),
    ]);

    setDeck(initial);
    setQueue([_0, _1, _2, _3, _4]);
    setWindows(
      Array(5)
        .fill(false)
        .map(() => ({ isOpen: true, isTargeted: false }))
    );

    /* eslint-ignore */
  }, []);

  // MARK: --- Actions ---

  /**
   * Forward the progress of the queue in front of the windows
   */
  const next = useCallback(() => {
    setQueue((prev) => {
      const [removed, ...stays] = prev.reverse();

      if (!deck.length) {
        setDeck([removed]);
        return [...stays, PLACEHOLDER[0]].reverse();
      }

      const [next, ...remains] = deck;
      setDeck([...remains, removed]);

      return [...stays, next].reverse();
    });
  }, [deck, setDeck, setQueue]);

  /**
   * Target a certain window
   *
   * @param i Index of the window
   */
  const lockOn = useCallback(
    (i: number) => {
      if (i < 0 || i > 4) return;

      setWindows((previousWindows) =>
        previousWindows.map((prev, j) => ({
          ...prev,
          isTargeted: i === j ? true : prev.isTargeted,
        }))
      );
    },
    [setWindows]
  );

  /**
   * Shot a window if the window is being locked-on
   *
   * @param i Index of the window
   */
  const fire = useCallback(
    (i: number) => {
      if (i < 0 || i > 4 || !windows[i].isTargeted) return;

      // Remove marking
      setWindows((previousWindows) =>
        previousWindows.map((prev, j) => ({
          ...prev,
          isTargeted: i === j ? false : prev.isTargeted,
          isOpen: i === j ? true : prev.isOpen,
        }))
      );

      // Remove agent
      setQueue((prev) => {
        const left = prev.filter((_, j) => i !== j);
        if (!deck.length) {
          return [PLACEHOLDER[0], ...left];
        }

        const [next, ...rest] = deck;
        setDeck(rest);
        return [next, ...left];
      });
    },
    [setQueue, setWindows, setDeck, windows, deck]
  );

  /**
   * Call a person behind a window to remove them from the queue
   *
   * @param i Index of the window
   */
  const call = useCallback(
    (i: number) => {
      if (i < 0 || i > 4) return;

      setQueue((prev) => {
        const saved = prev[i];
        const stays = prev.filter((_, j) => i !== j);

        if (!deck.length) {
          setDeck([saved]);
          return [...stays, PLACEHOLDER[0]].reverse();
        }

        const [next, ...remains] = deck;
        setDeck([...remains, saved]);

        return [...stays, next].reverse();
      });
    },
    [deck, setDeck, setQueue]
  );

  /**
   * Trap the next person to come in front the windows
   */
  const trap = useCallback(() => {
    if (!deck.length) return;

    setDeck(([_dead, ...remains]) => remains);
  }, [deck, setDeck]);

  /**
   * Close the shutter of a window until shot
   */
  const shutter = useCallback(
    () =>
      setWindows((prev) =>
        prev.map((window) => ({ ...window, isOpen: false }))
      ),
    [setWindows]
  );

  // MARK: --- EXPORTS ---

  return {
    state,
    allies,
    foes,
    next,
    lockOn,
    fire,
    call,
    trap,
    shutter,
  };
}

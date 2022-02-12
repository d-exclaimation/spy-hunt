//
//  useLangHunt.ts
//  web
//
//  Created by d-exclaimation on 16:36.
//
import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 } from "uuid";
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

type Agent = {
  team: string;
  key: string;
};

const newNeutral = (): Agent => ({
  team: PLACEHOLDER[0],
  key: v4(),
});

export function useHunt() {
  // MARK: --- States ---

  const [deck, setDeck] = useState<Agent[]>([]);
  const [queue, setQueue] = useState<Agent[]>([]);
  const [windows, setWindows] = useState<Window[]>([]);

  const state = useMemo(
    () => queue.map((team, i) => ({ ...team, ...windows[i] })),
    [queue, windows]
  );

  const allies = useMemo(
    () =>
      [...deck, ...queue].filter(({ team }) => team === PLACEHOLDER[1]).length,
    [deck, queue]
  );

  const foes = useMemo(
    () =>
      [...deck, ...queue].filter(({ team }) => team === PLACEHOLDER[2]).length,
    [deck, queue]
  );

  /**
   * Initial State
   */
  useEffect(() => {
    const neutral = Array<string>(20)
      .fill(PLACEHOLDER[0])
      .map((team) => ({ team, key: v4() }));
    const allies = Array<string>(20)
      .fill(PLACEHOLDER[1])
      .map((team: string) => ({ team, key: v4() }));
    const foes = Array<string>(20)
      .fill(PLACEHOLDER[2])
      .map((team: string) => ({ team, key: v4() }));

    const [_0, _1, _2, _3, _4, ...initial] = shuffled<Agent>([
      ...allies,
      ...foes,
      ...neutral,
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
    const [removed, ...stays] = queue.reverse();
    const [next, ...remains] = !!deck.length ? deck : [newNeutral()];

    setDeck([...remains, removed]);
    setQueue([...stays, next].reverse());
  }, [deck, queue, setDeck, setQueue]);

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

      /// Get the next agent from deck
      const [next, ...rest] = !!deck.length ? deck : [newNeutral()];
      setDeck(rest);

      // Remove marking
      setWindows((previousWindows) =>
        previousWindows.map((prev, j) => ({
          ...prev,
          isTargeted: i === j ? false : prev.isTargeted,
          isOpen: i === j ? true : prev.isOpen,
        }))
      );

      // Remove agent
      setQueue((prev) => [next, ...prev.filter((_, j) => i !== j)]);
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

      const saved = queue[i];
      const stays = queue.filter((_, j) => i !== j);

      const [next, ...remains] = !!deck.length ? deck : [newNeutral()];
      setDeck([...remains, saved]);

      setQueue([next, ...stays]);
    },
    [deck, queue, setDeck, setQueue]
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

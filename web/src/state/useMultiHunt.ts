//
//  useMultiHunt.ts
//  web
//
//  Created by d-exclaimation on 13:26.
//
import { useCallback, useEffect, useReducer, useRef } from "react";
import { InMessage, WindowWithAgent } from "../models/types";
import { __WS__ } from "./../constant/env";
import { OutMessage } from "./../models/types";

const PLACEHOLDER: Record<number, string> = {
  0: "forest",
  1: "conglomerate",
  2: "empl",
};

type HuntStates = {
  state: WindowWithAgent[];
  allies: number;
  foes: number;
  isTurn: boolean;
};

const changeTeam = (curr: HuntStates) => ({
  ...curr,
  state: curr.state.map((a) => ({ ...a, team: PLACEHOLDER[a.team] })),
});

function huntReducer(curr: HuntStates, action: InMessage): HuntStates {
  console.log(action);
  switch (action.type) {
    case "update":
      return action.payload;
    case "start":
      return action.payload;
    case "end":
      const { state, win } = action.payload;
      return {
        state: state,
        allies: win ? curr.allies : 0,
        foes: win ? 0 : curr.foes,
        isTurn: false,
      };
  }
}

export function useMultiHunt() {
  const [state, dispatch] = useReducer(huntReducer, {
    state: [],
    allies: 1,
    foes: 1,
    isTurn: false,
  });
  const socket = useRef<WebSocket | null>(null);

  const onMessage = useCallback(
    (ev: MessageEvent<string>) => {
      const msg: InMessage = JSON.parse(ev.data);
      if (!msg.type || !msg.payload) return;

      dispatch(msg);
    },
    [dispatch]
  );

  const send = useCallback((msg: OutMessage) => {
    if (!socket.current) return;
    const json = JSON.stringify(msg);
    socket.current.send(json);
  }, []);

  /**
   * Forward the progress of the queue in front of the windows
   */
  const next = useCallback(() => {
    send({ type: "next" });
  }, []);

  /**
   * Target a certain window
   *
   * @param i Index of the window
   */
  const lockOn = useCallback((index: number) => {
    if (index < 0 || index > 4) return;
    send({ type: "lock", payload: { index } });
  }, []);

  /**
   * Shot a window if the window is being locked-on
   *
   * @param i Index of the window
   */
  const fire = useCallback((index: number) => {
    if (index < 0 || index > 4) return;
    send({ type: "fire", payload: { index } });
  }, []);

  /**
   * Call a person behind a window to remove them from the queue
   *
   * @param i Index of the window
   */
  const call = useCallback((index: number) => {
    if (index < 0 || index > 4) return;
    send({ type: "call", payload: { index } });
  }, []);

  /**
   * Close the shutter of a window until shot
   */
  const shutter = useCallback(() => send({ type: "shutter" }), []);

  useEffect(() => {
    const ws = new WebSocket(__WS__, ["spyhunt-ws"]);

    ws.onmessage = onMessage;

    socket.current = ws;

    return () => {
      ws.close();
    };
  }, [onMessage]);

  return { ...changeTeam(state), next, lockOn, fire, call, shutter };
}

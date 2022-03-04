//
//  client.ts
//  web
//
//  Created by d-exclaimation on 21:14.
//
import { useCallback, useEffect, useRef } from "react";
import { __WS__ } from "./../constant/env";
import { InMessage } from "./types";

function useWebSocket(callback: (msg: InMessage) => void) {
  const socket = useRef<WebSocket | null>(null);

  const send = useCallback((msg: object) => {
    if (!socket.current) return;
    const json = JSON.stringify(msg);
    socket.current.send(json);
  }, []);

  useEffect(() => {
    const ws = new WebSocket(__WS__, "spyhunt-ws");

    ws.onmessage = (ev: MessageEvent<string>) => {
      const msg: InMessage = JSON.parse(ev.data);
      if (!msg.type || !msg.payload) return;

      callback(msg);
    };

    socket.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  return send;
}

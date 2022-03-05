//
//  types.ts
//  web
//
//  Created by d-exclaimation on 21:25.
//

export type InMessage =
  | {
      type: "update";
      payload: {
        state: WindowWithAgent[];
        allies: number;
        foes: number;
        isTurn: boolean;
      };
    }
  | {
      type: "start";
      payload: {
        state: WindowWithAgent[];
        allies: number;
        foes: number;
        isTurn: boolean;
      };
    }
  | {
      type: "end";
      payload: { state: WindowWithAgent[]; win: boolean; reason: string };
    };

export type OutMessage =
  | { type: "lock"; payload: { index: number } }
  | { type: "fire"; payload: { index: number } }
  | { type: "call"; payload: { index: number } }
  | { type: "next" }
  | { type: "shutter" };

export type WindowWithAgent = {
  key: string;
  team: number;
  isOpen: boolean;
  isTargeted: boolean;
};

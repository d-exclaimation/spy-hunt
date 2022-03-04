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
        isTurn: number;
      };
    }
  | {
      type: "start";
      payload: {
        state: WindowWithAgent[];
        allies: number;
        foes: number;
        isTurn: number;
      };
    }
  | {
      type: "end";
      payload: { state: WindowWithAgent[]; win: boolean; reason: string };
    };

export type WindowWithAgent = {
  key: string;
  team: number;
  isOpen: boolean;
  isTargeted: boolean;
};

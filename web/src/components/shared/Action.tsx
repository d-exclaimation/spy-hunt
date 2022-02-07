//
//  Action.tsx
//  web
//
//  Created by d-exclaimation on 23:06.
//

import React from "react";
import { ActionCard } from "../../state/useAction";

type Props = {
  type: ActionCard["type"];
  currentAction: ActionCard["type"] | null;
  action: (type: ActionCard["type"]) => void;
  color: string;
  icon: string;
};

const Action: React.FC<Props> = ({
  type,
  currentAction,
  action,
  color,
  icon,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center w-32 h-16 mx-1 ${color} ${
        currentAction === type &&
        "outline outline-offset-2 outline-2 outline-green-500"
      } rounded-lg shadow-lg select-none active:scale-90`}
      onClick={() => action(type)}
    >
      <div className="font-mono text-white text-3xl">{icon}</div>
    </div>
  );
};

export default Action;

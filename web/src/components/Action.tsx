//
//  Action.tsx
//  web
//
//  Created by d-exclaimation on 23:06.
//

import { motion } from "framer-motion";
import React from "react";
import { ActionCard, ActiveAction } from "../state/useAction";

type Props = {
  type: ActionCard["type"];
  currentAction: ActiveAction | null;
  action: (type: ActionCard["type"], key: string) => void;
  color: string;
  icon: string;
  _key: string;
};

const Action: React.FC<Props> = ({
  type,
  currentAction,
  action,
  color,
  icon,
  _key,
}) => {
  return (
    <motion.div
      initial="coming"
      animate="in"
      exit="out"
      variants={{
        in: { x: 0, opacity: 1 },
        coming: { x: 25, opacity: 0 },
        out: {
          x: -150,
          opacity: 0,
          transition: { duration: 0.2 },
        },
      }}
      transition={{ type: "spring", velocity: 0.75, mass: 0.75 }}
    >
      <div
        className={`flex flex-col items-center justify-center w-32 h-16 mx-1 ${color} ${
          currentAction &&
          currentAction.key === _key &&
          "outline outline-offset-2 outline-2 outline-green-500"
        } rounded-lg shadow-lg select-none active:scale-90`}
        onClick={() => action(type, _key)}
      >
        <div className="font-mono text-white text-3xl">{icon}</div>
      </div>
    </motion.div>
  );
};

export default Action;

//
//  ActionView.tsx
//  web
//
//  Created by d-exclaimation on 00:04.
//

import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import React from "react";
import { ActionCard, ActiveAction } from "../state/useAction";
import Action from "./Action";

type Props = {
  playerHand: ActionCard[];
  currentAction: ActiveAction | null;
  action: (index: number) => (type: ActionCard["type"], key: string) => void;
};

const ActionView: React.FC<Props> = ({ playerHand, action, currentAction }) => {
  return (
    <AnimateSharedLayout>
      <AnimatePresence>
        {playerHand.map(({ key, type, color, icon }, i) => (
          <motion.div key={key}>
            <Action
              currentAction={currentAction}
              type={type}
              action={action(i)}
              color={color}
              icon={icon}
              _key={key}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </AnimateSharedLayout>
  );
};

export default ActionView;

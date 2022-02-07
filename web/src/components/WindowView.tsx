//
//  WindowView.tsx
//  web
//
//  Created by d-exclaimation on 16:07.
//

import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import React from "react";
import WindowCard from "./WindowCard";

type Props = {
  state: {
    isOpen: boolean;
    isTargeted: boolean;
    team: string;
    key: string;
  }[];
  onClickWindow: (i: number) => void;
};

const WindowView: React.FC<Props> = ({ onClickWindow, state }) => {
  return (
    <motion.div className="flex items-center justify-center flex-row">
      <AnimateSharedLayout>
        <AnimatePresence>
          {state.map(({ team, key, isOpen, isTargeted }, i) => {
            return (
              <motion.div key={key}>
                <WindowCard
                  team={team}
                  isOpen={isOpen}
                  isTargeted={isTargeted}
                  onClick={() => {
                    onClickWindow(i);
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </AnimateSharedLayout>
    </motion.div>
  );
};

export default WindowView;

//
//  WindowCard.tsx
//  web
//
//  Created by d-exclaimation on 18:04.
//

import { motion } from "framer-motion";
import React from "react";
import Card from "./Card";

type Props = {
  team: string;
  isOpen: boolean;
  isTargeted: boolean;
  onClick: () => void;
};

const WindowCard: React.FC<Props> = ({ team, isOpen, isTargeted, onClick }) => {
  return (
    <motion.div
      initial="coming"
      animate="in"
      exit="out"
      variants={{
        in: { x: 0, opacity: 1, transition: { delay: 0.2 } },
        coming: { x: -25, opacity: 0 },
        out: {
          x: 150,
          opacity: 0,
          transition: { duration: 0.2 },
        },
      }}
      transition={{ type: "spring", velocity: 0.5, mass: 1 }}
    >
      <div className="mx-1 active:scale-90" onClick={onClick}>
        <Card seed={isOpen ? team : undefined} isTargeted={isTargeted} />
      </div>
    </motion.div>
  );
};

export default WindowCard;

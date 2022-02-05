//
//  WindowCard.tsx
//  web
//
//  Created by d-exclaimation on 18:04.
//

import { motion, useIsPresent } from "framer-motion";
import React from "react";
import Card from "./shared/Card";

type Props = {
  team: string;
  isOpen: boolean;
  isTargeted: boolean;
  onClick: () => void;
};

const WindowCard: React.FC<Props> = ({ team, isOpen, isTargeted, onClick }) => {
  const isPresent = useIsPresent();
  return (
    <motion.div
      initial="coming"
      animate={isPresent ? "in" : "out"}
      variants={{
        in: { x: 0, opacity: 1 },
        coming: { x: -25, opacity: 0 },
        out: { x: 50, opacity: 0 },
      }}
      transition={{ type: "spring", velocity: 0.5, mass: 1 }}
      className="mx-1"
      onClick={onClick}
    >
      <Card seed={isOpen ? team : undefined} isTargeted={isTargeted} />
    </motion.div>
  );
};

export default WindowCard;

//
//  Card.tsx
//  web
//
//  Created by d-exclaimation on 21:17.
//

import React from "react";

type Props = {
  seed?: string;
  isTargeted: boolean;
};

const Card: React.FC<Props> = ({ seed }) => {
  const isOpen = !!seed;
  return (
    <div
      className={`flex flex-col ${
        isOpen ? "bg-cyan-50" : "bg-slate-700"
      } rounded-lg shadow-md select-none active:shadow-xl`}
    >
      {isOpen ? (
        <img
          className="m-2 rounded-lg w-56 h-56"
          src={`https://avatars.dicebear.com/api/micah/${seed}.svg`}
        />
      ) : (
        <div className="m-2 rounded-lg w-56 h-56" />
      )}
    </div>
  );
};

export default Card;

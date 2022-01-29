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

const Card: React.FC<Props> = ({ seed, isTargeted }) => {
  const isOpen = !!seed;
  return (
    <div
      className={`flex flex-col bg-white ${
        isOpen ? "bg-white" : "bg-slate-700"
      } rounded-lg shadow-md  select-none active:shadow-xl`}
    >
      {isOpen ? (
        <img
          className="m-2 rounded-lg w-64 h-64"
          src={`https://avatars.dicebear.com/api/micah/${seed}.svg`}
        />
      ) : (
        <div className="m-6 rounded-lg w-64 h-64"></div>
      )}

      <div className="flex justify-center my-6 w-auto">
        <span
          className={`${
            isOpen ? "text-white" : "text-slate-700"
          } text-4xl text-center`}
        >
          {isTargeted ? "🎯" : "_"}
        </span>
      </div>
    </div>
  );
};

export default Card;

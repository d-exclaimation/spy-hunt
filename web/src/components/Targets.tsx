//
//  Targets.tsx
//  web
//
//  Created by d-exclaimation on 16:03.
//

import React from "react";

type Props = {
  state: {
    isOpen: boolean;
    isTargeted: boolean;
    team: string;
    key: string;
  }[];
  onClickWindow: (i: number) => void;
};

const Targets: React.FC<Props> = ({ state, onClickWindow }) => {
  return (
    <div className="flex items-center justify-center flex-row mt-4">
      {state.map(({ isTargeted, key }, i) => (
        <div
          className="flex justify-center py-2 mx-1 w-60 bg-slate-600 rounded-lg active:scale-90"
          key={key}
          onClick={() => onClickWindow(i)}
        >
          <span className="text-slate-600 text-4xl text-center">
            {isTargeted ? "🎯" : "_"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Targets;

//
//  Action.tsx
//  web
//
//  Created by d-exclaimation on 23:06.
//

import React from "react";

type Props = {
  action: string;
};

const Action: React.FC<Props> = ({ action }) => {
  return (
    <div className="flex flex-col items-center justify-center w-32 h-16 mx-1 bg-white rounded-lg shadow-lg select-none active:scale-90">
      <div className="font-mono text-slate-800 text-lg">{action}</div>
    </div>
  );
};

export default Action;

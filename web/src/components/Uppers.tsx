//
//  Uppers.tsx
//  web
//
//  Created by d-exclaimation on 17:54.
//

import React from "react";

const Uppers: React.FC = () => {
  return (
    <div className="flex items-center justify-center flex-row mb-4">
      {[0, 1, 2, 3, 4].map((_, i) => (
        <div
          className="flex justify-center py-2 mx-1 w-60 bg-slate-600 rounded-lg active:scale-90"
          key={i}
        >
          <span className="text-slate-600 text-4xl text-center">{"_"}</span>
        </div>
      ))}
    </div>
  );
};

export default Uppers;

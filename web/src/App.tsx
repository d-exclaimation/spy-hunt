import React from "react";
import Action from "./components/shared/Action";
import Card from "./components/shared/Card";
import { useLangHunt } from "./state/useLangHunt";

const App: React.FC = () => {
  const { agents, windows, targetWindow, shotWindow } = useLangHunt();

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-slate-800">
      <div className="flex items-center justify-center flex-row">
        {agents.map(({ team }, i) => {
          const { isOpen, isTargeted } = windows[i];
          return (
            <div
              className="active:scale-90 mx-1"
              key={i}
              onClick={() => {
                if (isTargeted) {
                  shotWindow(i);
                } else {
                  targetWindow(i);
                }
              }}
            >
              <Card seed={isOpen ? team : undefined} isTargeted={isTargeted} />
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-6 flex items-center justify-center">
        <Action action="Target" />
        <Action action="Target" />
        <Action action="Target" />
      </div>
    </div>
  );
};

export default App;

import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import React, { useState } from "react";
import WindowCard from "./components/WindowCard";
import { useHunt } from "./state/useHunt";

const App: React.FC = () => {
  const { state, lockOn, fire, next, call, allies, foes } = useHunt();
  const [currentAction, setAction] = useState<"lock" | "fire" | "call" | null>(
    null
  );

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-slate-800">
      <div className="absolute top-5 left-5 font-mono text-blue-400">
        Allies: {allies}
      </div>
      <div className="absolute top-5 right-5 font-mono text-red-400">
        Foes: {foes}
      </div>
      <motion.div className="flex items-center justify-center flex-row">
        <AnimateSharedLayout>
          <AnimatePresence>
            {state.map(({ team, key, isOpen, isTargeted }, i) => {
              return (
                <motion.div key={key}>
                  <WindowCard
                    {...{
                      team,
                      isOpen,
                      isTargeted,
                      onClick: () => {
                        setAction((prev) => {
                          if (!prev) return null;
                          switch (prev) {
                            case "lock":
                              lockOn(i);
                              break;
                            case "fire":
                              fire(i);
                              break;
                            case "call":
                              call(i);
                              break;
                          }
                          return null;
                        });
                      },
                    }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </AnimateSharedLayout>
      </motion.div>
      <div className="absolute bottom-6 flex items-center justify-center">
        <div
          className={`flex flex-col items-center justify-center w-32 h-16 mx-1 bg-violet-300 ${
            currentAction === "fire" &&
            "outline outline-offset-2 outline-2 outline-green-500"
          } rounded-lg shadow-lg select-none active:scale-90`}
          onClick={() => setAction("fire")}
        >
          <div className="font-mono text-white text-3xl">🚀</div>
        </div>
        <div
          className={`flex flex-col items-center justify-center w-32 h-16 mx-1 bg-blue-300 ${
            currentAction === "lock" &&
            "outline outline-offset-2 outline-2 outline-green-500"
          } rounded-lg shadow-lg select-none active:scale-90`}
          onClick={() => setAction("lock")}
        >
          <div className="font-mono text-white text-3xl">🔭</div>
        </div>
        <div
          className={`flex flex-col items-center justify-center w-32 h-16 mx-1 bg-emerald-300 ${
            currentAction === "call" &&
            "outline outline-offset-2 outline-2 outline-green-500"
          } rounded-lg shadow-lg select-none active:scale-90`}
          onClick={() => setAction("call")}
        >
          <div className="font-mono text-white text-3xl">📞</div>
        </div>
        <div
          className="flex flex-col items-center justify-center w-32 h-16 mx-1 bg-red-300 rounded-lg shadow-lg select-none active:scale-90"
          onClick={() => next()}
        >
          <div className="font-mono text-white text-3xl">🚨</div>
        </div>
      </div>
    </div>
  );
};

export default App;

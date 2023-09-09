"use client";

import { createContext } from "react";

export const GameContext = createContext({ playing: false });

export default function GameProvider({ children }: React.PropsWithChildren) {
    return (
        <GameContext.Provider value={{ playing: false }}>
            {children}
        </GameContext.Provider>
    );
}

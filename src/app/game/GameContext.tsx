"use client";

import { createContext, useState } from "react";

export const GameContext = createContext<{
    playing: boolean;
    tracksHref: string[];
    addTracksHref: (id: string) => void;
    removeTracksHref: (id: string) => void;
    setPlaying: (value: boolean) => void;
}>({
    playing: false,
    tracksHref: [],
    setPlaying: (value) => {},
    addTracksHref: (playlist) => {},
    removeTracksHref: (playlist) => {},
});

export default function GameProvider({ children }: React.PropsWithChildren) {
    const [tracksHref, setTracksHref] = useState<string[]>([]);
    const [playing, setPlaying] = useState(false);

    function addTracksHref(id: string) {
        setTracksHref([...tracksHref, id]);
    }

    function removeTracksHref(id: string) {
        setTracksHref((playlists) => {
            return playlists.filter((playlist) => playlist !== id);
        });
    }

    return (
        <GameContext.Provider
            value={{
                playing,
                tracksHref,
                addTracksHref,
                removeTracksHref,
                setPlaying,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

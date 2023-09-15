"use client";

import { Track } from "@/types";
import { createContext, useState } from "react";

export const GameContext = createContext<{
    tracksHref: string[];
    addTracksHref: (id: string) => void;
    removeTracksHref: (id: string) => void;
    tracks: Track[];
    setTracks: (arg: any) => void;
}>({
    tracksHref: [],
    addTracksHref: (playlist) => {},
    removeTracksHref: (playlist) => {},
    tracks: [],
    setTracks: (arg) => {},
});

export default function GameProvider({ children }: React.PropsWithChildren) {
    const [tracksHref, setTracksHref] = useState<string[]>([]);
    const [tracks, setTracks] = useState([]);

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
                tracksHref,
                addTracksHref,
                removeTracksHref,
                tracks,
                setTracks,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

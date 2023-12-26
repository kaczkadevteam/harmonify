"use client";

import { trackIntoGuessString } from "@/modules/tracks";
import { Album, GameResult, Track } from "@/types";
import { createContext, useMemo, useState } from "react";

export const GameContext = createContext<{
    tracksHref: string[];
    addTracksHref: (id: string) => void;
    removeTracksHref: (id: string) => void;
    selectedAlbums: Album<Track>[];
    selectAlbum: (album: Album<Track>) => void;
    deselectAlbum: (album: Album<Track>) => void;
    tracks: Track[];
    setTracks: (arg: any) => void;
    drawnTracks: Track[];
    setDrawnTracks: (arg: any) => void;
    finalScore: number;
    setFinalScore: (score: number) => void;
    lastGameResult: GameResult | undefined;
    setLastGameResult: (result: GameResult) => void;
    roundsCount: number;
    roundTime: number;
    trackTime: number;
    lowerLimit_perc: number;
    upperLimit_perc: number;
}>({
    tracksHref: [],
    addTracksHref: (playlist) => {},
    removeTracksHref: (playlist) => {},
    selectedAlbums: [],
    selectAlbum: (album) => {},
    deselectAlbum: (album) => {},
    tracks: [],
    setTracks: (arg) => {},
    drawnTracks: [],
    setDrawnTracks: (arg) => {},
    finalScore: 0,
    setFinalScore: (arg) => {},
    lastGameResult: { score: 0, guessedTracks: [] },
    setLastGameResult: (arg) => {},
    roundsCount: 10,
    roundTime: 30,
    trackTime: 10,
    lowerLimit_perc: 0,
    upperLimit_perc: 1,
});

export default function GameProvider({ children }: React.PropsWithChildren) {
    const [tracksHref, setTracksHref] = useState<string[]>([]);
    const [selectedAlbums, setSelectedAlbums] = useState<Album<Track>[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [drawnTracks, setDrawnTracks] = useState<Track[]>([]);
    const [finalScore, setFinalScore] = useState(0);
    const [lastGameResult, setLastGameResult] = useState<
        GameResult | undefined
    >(undefined);

    function addTracksHref(id: string) {
        setTracksHref([...tracksHref, id]);
    }

    function removeTracksHref(id: string) {
        setTracksHref((playlists) => {
            return playlists.filter((playlist) => playlist !== id);
        });
    }

    function selectAlbum(album: Album<Track>) {
        setSelectedAlbums((prevAlbums) => [...prevAlbums, album]);
    }

    function deselectAlbum(album: Album<Track>) {
        setSelectedAlbums((prevAlbums) =>
            prevAlbums.filter((prevAlbum) => prevAlbum.id !== album.id)
        );
    }

    return (
        <GameContext.Provider
            value={{
                tracksHref,
                addTracksHref,
                removeTracksHref,
                selectedAlbums,
                selectAlbum,
                deselectAlbum,
                tracks,
                setTracks,
                drawnTracks,
                setDrawnTracks,
                finalScore,
                setFinalScore,
                lastGameResult,
                setLastGameResult,
                roundsCount: 10,
                roundTime: 30,
                trackTime: 10,
                lowerLimit_perc: 0,
                upperLimit_perc: 1,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

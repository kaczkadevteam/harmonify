"use client";

import { Track } from "@/types";
import { createContext, useMemo, useState } from "react";

export function trackIntoGuessString(track: Track) {
    return `${track.name} - ${track.artists
        .reduce((acc, artist) => {
            return `${acc}, ${artist.name}`;
        }, "")
        .slice(2)}`;
}

export const GameContext = createContext<{
    tracksHref: string[];
    addTracksHref: (id: string) => void;
    removeTracksHref: (id: string) => void;
    tracks: Track[];
    setTracks: (arg: any) => void;
    finalScore: number;
    setFinalScore: (score: number) => void;
}>({
    tracksHref: [],
    addTracksHref: (playlist) => {},
    removeTracksHref: (playlist) => {},
    tracks: [],
    setTracks: (arg) => {},
    finalScore: 0,
    setFinalScore: (arg) => {},
});

export default function GameProvider({ children }: React.PropsWithChildren) {
    const [tracksHref, setTracksHref] = useState<string[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [finalScore, setFinalScore] = useState(0);

    function addTracksHref(id: string) {
        setTracksHref([...tracksHref, id]);
    }

    function removeTracksHref(id: string) {
        setTracksHref((playlists) => {
            return playlists.filter((playlist) => playlist !== id);
        });
    }

    const tracksWithGuess = useMemo(() => {
        return (
            tracks
                // Remove overlapping tracks
                .reduce<Track[]>((filteredTracks, track) => {
                    if (
                        !filteredTracks.some(
                            (someTrack) => someTrack.uri === track.uri
                        )
                    ) {
                        filteredTracks.push(track);
                    }
                    return filteredTracks;
                }, [])
                .map((track) => {
                    return { ...track, guess: trackIntoGuessString(track) };
                })
        );
    }, [tracks]);

    return (
        <GameContext.Provider
            value={{
                tracksHref,
                addTracksHref,
                removeTracksHref,
                tracks: tracksWithGuess,
                setTracks,
                finalScore,
                setFinalScore,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

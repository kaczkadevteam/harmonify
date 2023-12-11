"use client";

import { Album, Track } from "@/types";
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
    selectedAlbums: Album<Track>[];
    selectAlbum: (album: Album<Track>) => void;
    deselectAlbum: (album: Album<Track>) => void;
    tracks: Track[];
    setTracks: (arg: any) => void;
    finalScore: number;
    setFinalScore: (score: number) => void;
}>({
    tracksHref: [],
    addTracksHref: (playlist) => {},
    removeTracksHref: (playlist) => {},
    selectedAlbums: [],
    selectAlbum: (album) => {},
    deselectAlbum: (album) => {},
    tracks: [],
    setTracks: (arg) => {},
    finalScore: 0,
    setFinalScore: (arg) => {},
});

export default function GameProvider({ children }: React.PropsWithChildren) {
    const [tracksHref, setTracksHref] = useState<string[]>([]);
    const [selectedAlbums, setSelectedAlbums] = useState<Album<Track>[]>([]);
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

    function selectAlbum(album: Album<Track>) {
        setSelectedAlbums((prevAlbums) => [...prevAlbums, album]);
    }

    function deselectAlbum(album: Album<Track>) {
        setSelectedAlbums((prevAlbums) =>
            prevAlbums.filter((prevAlbum) => prevAlbum.id !== album.id)
        );
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
                selectedAlbums,
                selectAlbum,
                deselectAlbum,
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

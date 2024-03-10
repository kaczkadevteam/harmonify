"use client";

import { Album, GameResult, Track } from "@/types";
import { createContext, useState } from "react";

export const GameContext = createContext<{
    tracksHref: string[];
    favouritesSelected: boolean;
    setFavouritesSelected: (v: boolean) => void;
    addTracksHref: (id: string) => void;
    removeTracksHref: (id: string) => void;
    selectedAlbums: Album<Track>[];
    selectAlbum: (album: Album<Track>) => void;
    deselectAlbum: (album: Album<Track>) => void;
    tracks: Track[];
    setTracks: (arg: any) => void;
    drawnTracks: Track[];
    setDrawnTracks: (arg: any) => void;
    lastGameResult: GameResult | undefined;
    setLastGameResult: (result: GameResult) => void;
}>({
    tracksHref: [],
    favouritesSelected: false,
    setFavouritesSelected: (v) => {},
    addTracksHref: (playlist) => {},
    removeTracksHref: (playlist) => {},
    selectedAlbums: [],
    selectAlbum: (album) => {},
    deselectAlbum: (album) => {},
    tracks: [],
    setTracks: (arg) => {},
    drawnTracks: [],
    setDrawnTracks: (arg) => {},
    lastGameResult: { score: 0, playedTracks: [] },
    setLastGameResult: (arg) => {},
});

export default function GameProvider({ children }: React.PropsWithChildren) {
    const [tracksHref, setTracksHref] = useState<string[]>([]);
    const [selectedAlbums, setSelectedAlbums] = useState<Album<Track>[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [drawnTracks, setDrawnTracks] = useState<Track[]>([]);
    const [lastGameResult, setLastGameResult] = useState<
        GameResult | undefined
    >(undefined);
    const [favouritesSelected, setFavouritesSelected] = useState(false);

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
                favouritesSelected,
                setFavouritesSelected,
                addTracksHref,
                removeTracksHref,
                selectedAlbums,
                selectAlbum,
                deselectAlbum,
                tracks,
                setTracks,
                drawnTracks,
                setDrawnTracks,
                lastGameResult,
                setLastGameResult,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

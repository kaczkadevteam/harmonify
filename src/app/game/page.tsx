import { fetchFromSpotify } from "@/fetch";
import { cookies } from "next/headers";
import React from "react";
import GameProvider from "./components/gameContext/GameContext";
import {
    Album,
    SimplePlaylistObject,
    SimplifiedTrackObject,
    Track,
} from "@/types";
import Quiz from "./components/quiz/Quiz";

async function getAllPaginatedItems<T>(url: string, accessToken: string) {
    let next = url;
    let collected: { total: number; items: T[] } = {
        total: 0,
        items: [],
    };

    while (next) {
        const response = await fetchFromSpotify(
            next,
            accessToken,
            undefined,
            true
        );
        const result: {
            total: number;
            items: T[];
            next: string;
        } = await response.json();

        collected.total += result.total;
        collected.items = [...collected.items, ...result.items];

        next = result.next;
    }

    return collected;
}

export default async function GamePage() {
    const access_token = cookies().get("access_token")!.value;

    const userResponse = await fetchFromSpotify(`/me`, access_token);
    const userResult = await userResponse.json();
    const { id } = userResult;

    let playlistURL = `${process.env.NEXT_PUBLIC_SPOTIFY_URL}/users/${id}/playlists?limit=50`;
    let playlists = await getAllPaginatedItems<SimplePlaylistObject>(
        playlistURL,
        access_token
    );

    let albumsURL = `${process.env.NEXT_PUBLIC_SPOTIFY_URL}/me/albums?limit=50`;
    let rawAlbums = await getAllPaginatedItems<{
        album: Album<SimplifiedTrackObject>;
    }>(albumsURL, access_token);

    const albums = {
        total: rawAlbums.total,
        items: rawAlbums.items.map<Album<Track>>((i) => {
            const a = i.album;
            return {
                ...a,
                tracks: {
                    items: (a.tracks.items = a.tracks.items.map<Track>((t) => {
                        return { ...t, album: { images: a.images } };
                    })),
                },
            };
        }),
    };

    return (
        <GameProvider>
            <Quiz playlists={playlists} albums={albums} />
        </GameProvider>
    );
}

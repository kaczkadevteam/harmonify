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

export default async function GamePage() {
    const access_token = cookies().get("access_token")!.value;

    const userResponse = await fetchFromSpotify(`/me`, access_token);
    const userResult = await userResponse.json();
    const { id } = userResult;

    const playlistsResponse = await fetchFromSpotify(
        `/users/${id}/playlists?limit=50`,
        access_token
    );
    const playlistsResult: { items: SimplePlaylistObject[]; total: number } =
        await playlistsResponse.json();

    let nextAlbums = `${process.env.NEXT_PUBLIC_SPOTIFY_URL}/me/albums?limit=50`;
    let albums: { total: number; items: Album<Track>[] } = {
        total: 0,
        items: [],
    };
    let safeguard = 0;

    while (nextAlbums && safeguard < 10) {
        const albumsResponse = await fetchFromSpotify(
            nextAlbums,
            access_token,
            undefined,
            true
        );
        const albumsResult: {
            items: { album: Album<SimplifiedTrackObject> }[];
            total: number;
            next: string;
        } = await albumsResponse.json();

        albums.total += albumsResult.total;
        albums.items = [
            ...albums.items,
            ...albumsResult.items.map<Album<Track>>((i) => {
                const a = i.album;
                return {
                    ...a,
                    tracks: {
                        items: (a.tracks.items = a.tracks.items.map<Track>(
                            (t) => {
                                return { ...t, album: { images: a.images } };
                            }
                        )),
                    },
                };
            }),
        ];
        nextAlbums = albumsResult.next;

        safeguard++;
    }

    return (
        <GameProvider>
            <Quiz playlists={playlistsResult} albums={albums} />
        </GameProvider>
    );
}

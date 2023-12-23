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

    let nextPlaylist = `${process.env.NEXT_PUBLIC_SPOTIFY_URL}/users/${id}/playlists?limit=50`;
    let playlists: {
        items: SimplePlaylistObject[];
        total: number;
    } = { total: 0, items: [] };

    while (nextPlaylist) {
        const playlistsResponse = await fetchFromSpotify(
            nextPlaylist,
            access_token,
            undefined,
            true
        );
        const playlistsResult: {
            items: SimplePlaylistObject[];
            total: number;
            next: string;
        } = await playlistsResponse.json();

        playlists.total += playlistsResult.total;
        playlists.items = [...playlists.items, ...playlistsResult.items];

        nextPlaylist = playlistsResult.next;
    }

    let nextAlbums = `${process.env.NEXT_PUBLIC_SPOTIFY_URL}/me/albums?limit=50`;
    let albums: { total: number; items: Album<Track>[] } = {
        total: 0,
        items: [],
    };

    while (nextAlbums) {
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
    }

    return (
        <GameProvider>
            <Quiz playlists={playlists} albums={albums} />
        </GameProvider>
    );
}

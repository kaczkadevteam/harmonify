import { fetchFromSpotify } from "@/fetch";
import { cookies } from "next/headers";
import React from "react";
import GameProvider from "./components/GameContext";
import {
    Album,
    SimplePlaylistObject,
    SimplifiedTrackObject,
    Track,
} from "@/types";
import Quiz from "./components/Quiz";

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

    const albumsResponse = await fetchFromSpotify(
        `/me/albums?limit=50`,
        access_token
    );
    const albumsResult: {
        items: Album<SimplifiedTrackObject>[];
        total: number;
    } = await albumsResponse.json();

    console.log(albumsResult);

    const transformedAlbums = {
        ...albumsResult,
        items: albumsResult.items.map<Album<Track>>((a) => {
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
            <Quiz playlists={playlistsResult} albums={transformedAlbums} />
        </GameProvider>
    );
}

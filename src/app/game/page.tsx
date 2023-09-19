import { fetchFromSpotify } from "@/fetch";
import { cookies } from "next/headers";
import React from "react";
import GameProvider from "./components/GameContext";
import { SimplePlaylistObject } from "../../types";
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

    return (
        <GameProvider>
            <Quiz playlists={playlistsResult} />
        </GameProvider>
    );
}

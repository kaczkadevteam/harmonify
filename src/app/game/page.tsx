import { fetchFromSpotify } from "@/fetch";
import { cookies } from "next/headers";
import React from "react";
import GameProvider from "./GameContext";
import Image from "next/image";
import styles from "./page.module.scss";
import { SimplePlaylistObject } from "../../types";
import PlaylistCard from "./PlaylistCard";
import StartButton from "./StartButton";
import Game from "./Game";

export default async function Giam() {
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
            <main className={styles["main"]}>
                <aside className={styles["playlist-list"]}>
                    {playlistsResult.items.map((playlist) => {
                        return (
                            <PlaylistCard
                                key={playlist.id}
                                playlist={playlist}
                            />
                        );
                    })}
                </aside>
                <StartButton />
                {<Game />}
            </main>
        </GameProvider>
    );
}

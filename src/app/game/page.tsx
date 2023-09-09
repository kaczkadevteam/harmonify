import { fetchFromSpotify } from "@/fetch";
import { cookies } from "next/headers";
import React from "react";
import GameProvider from "./GameContext";
import Image from "next/image";
import styles from "./page.module.scss";

type SimplePlaylistObject = {
    id: string;
    images: ImageObject[];
    name: string;
    tracks: {
        href: string;
        total: number;
    };
};

type ImageObject = {
    url: string;
    height?: number;
    width?: number;
};

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
            <main>
                <aside className={styles["playlist-list"]}>
                    {playlistsResult.items.map((playlist) => {
                        const { url, width, height } = playlist.images[0];

                        return (
                            <div
                                key={playlist.id}
                                className={styles["playlist-card"]}
                            >
                                <Image
                                    src={url}
                                    alt="Playlist icon"
                                    width={350}
                                    height={350}
                                />
                                <span key={playlist.id}>{playlist.name}</span>
                            </div>
                        );
                    })}
                </aside>
            </main>
        </GameProvider>
    );
}

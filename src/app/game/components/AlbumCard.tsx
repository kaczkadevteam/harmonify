"use client";

import Image from "next/image";
import { Album, SimplifiedTrackObject } from "@/types";
import styles from "./playlistCard.module.scss";
import { useContext } from "react";
import { GameContext } from "./GameContext";

export default function PlaylistCard({
    album,
}: {
    album: Album<SimplifiedTrackObject>;
}) {
    const game = useContext(GameContext);
    const { url: imageUrl } = album.images[0];

    return (
        <label htmlFor={album.id}>
            <div className={styles["playlist-card"]}>
                <div className={styles["img-container"]}>
                    <Image
                        src={imageUrl}
                        alt="Playlist icon"
                        sizes="100%"
                        fill
                    />
                </div>
                <span>{album.name}</span>
            </div>
        </label>
    );
}

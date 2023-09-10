"use client";

import Image from "next/image";
import { SimplePlaylistObject } from "../../types";
import styles from "./playlistCard.module.scss";
import { useContext, useState } from "react";
import { GameContext } from "./GameContext";

export default function PlaylistCard({
    playlist,
}: {
    playlist: SimplePlaylistObject;
}) {
    const game = useContext(GameContext);
    const { url: imageUrl } = playlist.images[0];

    return (
        <label htmlFor={playlist.id}>
            <div className={styles["playlist-card"]}>
                <div className={styles["img-container"]}>
                    <Image src={imageUrl} alt="Playlist icon" fill />
                </div>
                <span>{playlist.name}</span>

                <input
                    id={playlist.id}
                    type="checkbox"
                    checked={game.tracksHref.includes(playlist.tracks.href)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            game.addTracksHref(playlist.tracks.href);
                        } else {
                            game.removeTracksHref(playlist.tracks.href);
                        }
                    }}
                />
            </div>
        </label>
    );
}

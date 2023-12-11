"use client";

import Image from "next/image";
import { Album, Track } from "@/types";
import styles from "../playlistCard/playlistCard.module.scss";
import { useContext } from "react";
import { GameContext } from "../gameContext/GameContext";

export default function AlbumCard({
    album,
    selected,
    selectAlbum,
    deselectAlbum,
}: {
    album: Album<Track>;
    selected: boolean;
    selectAlbum: (album: Album<Track>) => void;
    deselectAlbum: (album: Album<Track>) => void;
}) {
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

                <input
                    id={album.id}
                    type="checkbox"
                    checked={selected}
                    onChange={(e) => {
                        if (e.target.checked) {
                            selectAlbum(album);
                        } else {
                            deselectAlbum(album);
                        }
                    }}
                />
            </div>
        </label>
    );
}

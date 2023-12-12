"use client";

import { SimplePlaylistObject } from "@/types";
import { useContext } from "react";
import { GameContext } from "../gameContext/GameContext";
import CheckableCard from "../checkableCard/CheckableCard";

export default function PlaylistCard({
    playlist,
}: {
    playlist: SimplePlaylistObject;
}) {
    const game = useContext(GameContext);
    const { url: imageUrl } = playlist.images[0];

    return (
        <CheckableCard
            id={playlist.id}
            title={playlist.name}
            imageSrc={imageUrl}
            imageAlt="Playlist cover"
            checked={game.tracksHref.includes(playlist.tracks.href)}
            onCheck={() => game.addTracksHref(playlist.tracks.href)}
            onUncheck={() => game.removeTracksHref(playlist.tracks.href)}
        />
    );
}

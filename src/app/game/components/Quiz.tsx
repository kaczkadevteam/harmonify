"use client";

import React, { useEffect, useState } from "react";
import Setup from "./Setup";
import Game from "./Game";
import { SimplePlaylistObject } from "@/types";
import useSpotifyPlayer from "./SpotifyPlayer";

export default function Quiz({
    playlists,
}: {
    playlists: { items: SimplePlaylistObject[]; total: number };
}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const playerObj = useSpotifyPlayer();

    if (!isPlaying) {
        return (
            <Setup
                playlists={playlists}
                playerObj={playerObj}
                startGame={() => {
                    setIsPlaying(true);
                }}
            />
        );
    } else {
        return <Game playerObj={playerObj} />;
    }
}

"use client";

import React, { useState } from "react";
import Setup from "../setup/Setup";
import Game from "../game/Game";
import { Album, SimplePlaylistObject, Track } from "@/types";
import useSpotifyPlayer from "../../hooks/useSpotifyPlayer";
import Finish from "../finish/Finish";

export default function Quiz({
    playlists,
    albums,
}: {
    playlists: { items: SimplePlaylistObject[]; total: number };
    albums: { items: Album<Track>[]; total: number };
}) {
    const [gameStage, setGameStage] = useState<"setup" | "game" | "finish">(
        "setup"
    );
    const playerObj = useSpotifyPlayer();

    function advanceStage() {
        switch (gameStage) {
            case "setup":
                setGameStage("game");
                break;
            case "game":
                setGameStage("finish");
                break;
            case "finish":
                setGameStage("setup");
                break;
        }
    }

    switch (gameStage) {
        case "setup":
            return (
                <Setup
                    playlists={playlists}
                    albums={albums}
                    playerObj={playerObj}
                    startGame={() => {
                        advanceStage();
                    }}
                />
            );
        case "game":
            return <Game playerObj={playerObj} finishGame={advanceStage} />;
        case "finish":
            return <Finish playAgain={advanceStage} />;
    }
}

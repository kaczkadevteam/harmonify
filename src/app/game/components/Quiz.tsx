"use client";

import React, { useEffect, useState } from "react";
import Setup from "./Setup";
import Game from "./Game";
import { SimplePlaylistObject } from "@/types";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";
import Finish from "./Finish";

export default function Quiz({
    playlists,
}: {
    playlists: { items: SimplePlaylistObject[]; total: number };
}) {
    const [isPlaying, setIsPlaying] = useState(false);
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

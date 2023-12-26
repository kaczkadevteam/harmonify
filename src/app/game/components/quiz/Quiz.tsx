"use client";

import React, { useContext, useState } from "react";
import Setup from "../setup/Setup";
import Game from "../game/Game";
import { Album, GameResult, SimplePlaylistObject, Track } from "@/types";
import useSpotifyPlayer from "../../hooks/useSpotifyPlayer";
import Finish from "../finish/Finish";
import { GameContext } from "../gameContext/GameContext";

export default function Quiz({
    playlists,
    albums,
}: {
    playlists: { items: SimplePlaylistObject[]; total: number };
    albums: { items: Album<Track>[]; total: number };
}) {
    const gameContext = useContext(GameContext);
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

    function onGameFinish(gameResult: GameResult) {
        gameContext.setLastGameResult(gameResult);
        advanceStage();
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
            return (
                <Game
                    playerObj={playerObj}
                    finishGame={onGameFinish}
                    gameData={Object.freeze({
                        roundCount: 10,
                        roundDuration: 30,
                        trackDuration: 10,
                        trackLowerLimit_perc: 0,
                        trackUpperLimit_perc: 1,
                        tracks: gameContext.tracks,
                        selectedTracks: gameContext.drawnTracks,
                    })}
                />
            );
        case "finish":
            return <Finish playAgain={advanceStage} />;
    }
}

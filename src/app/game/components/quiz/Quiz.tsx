"use client";

import React, { useContext, useState } from "react";
import Setup from "../setup/Setup";
import Game from "../game/Game";
import {
    Album,
    GameData,
    GameResult,
    SimplePlaylistObject,
    Track,
} from "@/types";
import useSpotifyPlayer from "../../hooks/useSpotifyPlayer";
import Finish from "../finish/Finish";
import { GameContext } from "../gameContext/GameContext";
import Script from "next/script";

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
    const [gameData, setGameData] = useState<GameData>();
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

    function onGameStart(gameData: GameData) {
        setGameData(gameData);
        advanceStage();
    }

    function onGameFinish(gameResult: GameResult) {
        gameContext.setLastGameResult(gameResult);
        advanceStage();
    }

    let pageContent: any;

    switch (gameStage) {
        case "setup":
            pageContent = (
                <Setup
                    playlists={playlists}
                    albums={albums}
                    playerObj={playerObj}
                    startGame={onGameStart}
                />
            );
            break;
        case "game":
            pageContent = (
                <Game
                    playerObj={playerObj}
                    finishGame={onGameFinish}
                    gameData={Object.freeze(gameData!)}
                />
            );
            break;
        case "finish":
            pageContent = gameContext.lastGameResult && (
                <Finish
                    gameResult={gameContext.lastGameResult}
                    playAgain={advanceStage}
                />
            );
            break;
    }

    return (
        <>
            {pageContent}
            <Script src="https://sdk.scdn.co/spotify-player.js" />
        </>
    );
}

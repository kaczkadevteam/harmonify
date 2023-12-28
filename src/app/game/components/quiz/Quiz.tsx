"use client";

import React, { useContext, useState } from "react";
import Setup from "../setup/Setup";
import Game from "../game/Game";
import { Album, GameResult, SimplePlaylistObject, Track } from "@/types";
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

    let pageContent: any;

    switch (gameStage) {
        case "setup":
            pageContent = (
                <Setup
                    playlists={playlists}
                    albums={albums}
                    playerObj={playerObj}
                    startGame={() => {
                        advanceStage();
                    }}
                />
            );
            break;
        case "game":
            pageContent = (
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

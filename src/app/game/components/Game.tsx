"use client";

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: any;
        Spotify: any;
    }
}

import styles from "./game.module.scss";
import { useCallback, useContext } from "react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GameContext } from "./GameContext";
import { fetchFromSpotify } from "@/fetch";
import { useRouter } from "next/navigation";
import { useTimer } from "react-timer-hook";
import dayjs from "dayjs";
import { Track } from "@/types";
import AutocompleteBar from "./AutocompleteBar";

function getTimerExpiryTimestamp(seconds: number) {
    return dayjs().add(seconds, "seconds").toDate();
}

export default function Game({
    playerObj,
}: {
    playerObj: {
        player: any;
        playerID: string;
    } | null;
}) {
    const roundTime = 60;
    const trackTime = 10;
    const lowerLimit_perc = 0;
    const upperLimit_perc = 1;

    const { player, playerID } = playerObj!;
    const game = useContext(GameContext);

    const randomlySelectedTrack = selectTrack();

    const router = useRouter();
    const [round, setRound] = useState(1);
    const [selectedTrack, setSelectedTrack] = useState<Track>(
        randomlySelectedTrack.track
    );
    const [began, setBegan] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackStart_ms, setTrackStart_ms] = useState(
        randomlySelectedTrack.trackStart_ms
    );
    const [guess, setGuess] = useState("");

    const trackTimer = useTimer({
        expiryTimestamp: getTimerExpiryTimestamp(trackTime),
        autoStart: false,
        onExpire: () => {
            restartTrackTimer();
        },
    });

    function selectTrack() {
        const track =
            game.tracks[Math.floor(Math.random() * game.tracks.length)];
        const { duration_ms } = track;
        const lowerLimit = duration_ms * lowerLimit_perc;
        const upperLimit = duration_ms * upperLimit_perc;
        const durationRange = upperLimit - lowerLimit;
        const trackStart_ms = Math.min(
            Math.floor(Math.random() * durationRange) + lowerLimit,
            duration_ms - 10 * 1000
        );

        return { trackStart_ms, track };
    }

    function restartTrackTimer() {
        trackTimer.restart(getTimerExpiryTimestamp(trackTime), false);
        player.seek(trackStart_ms);
        player.pause();
        setIsPlaying(false);
    }

    const advanceRound = useCallback(
        function () {
            const { trackStart_ms, track } = selectTrack();

            setRound((prev) => prev + 1);

            setTrackStart_ms(trackStart_ms);
            setSelectedTrack(track);
            setIsPlaying(false);
            setBegan(false);
            roundTimer.restart(getTimerExpiryTimestamp(roundTime), false);
            trackTimer.restart(getTimerExpiryTimestamp(trackTime), false);
            player.pause();
        },
        [player]
    );

    const roundTimer = useTimer({
        expiryTimestamp: getTimerExpiryTimestamp(roundTime),
        autoStart: false,
        onExpire: () => {
            advanceRound();
        },
    });

    async function togglePlay() {
        if (isPlaying) {
            player.pause();
            trackTimer.pause();
        } else {
            if (!began) {
                fetchFromSpotify(
                    `/me/player/play?device_id=${playerID}`,
                    Cookies.get("access_token") ?? "",
                    router,
                    false,
                    "PUT",
                    JSON.stringify({
                        uris: [selectedTrack?.uri],
                        position_ms: trackStart_ms,
                    })
                );
                setBegan(true);
                roundTimer.start();
            } else {
                player.resume();
            }
            trackTimer.resume();
        }

        setIsPlaying(!isPlaying);
    }

    return (
        <>
            <div>
                Runda: {round} Czas rundy: {roundTimer.totalSeconds} Czas
                muzyki: {trackTimer.totalSeconds}
            </div>
            <button onClick={togglePlay}>{isPlaying ? "STOP" : "START"}</button>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    console.log(`submitted ${guess}`);
                }}
            >
                <AutocompleteBar guess={guess} setGuess={setGuess} />
                <button type="submit">Submit</button>
                <span>
                    {selectedTrack?.guess === guess
                        ? "Good guess"
                        : "Bad guess"}
                </span>
            </form>

            <button
                onClick={() => {
                    advanceRound();
                }}
            >
                Skip round force
            </button>
        </>
    );
}

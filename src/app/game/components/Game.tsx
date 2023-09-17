"use client";

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: any;
        Spotify: any;
    }
}

import styles from "./game.module.scss";
import { useCallback, useContext, useRef } from "react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GameContext } from "./GameContext";
import { fetchFromSpotify } from "@/fetch";
import { useRouter } from "next/navigation";
import { useTimer } from "react-timer-hook";
import dayjs from "dayjs";
import { Track } from "@/types";
import AutocompleteBar from "./AutocompleteBar";
import { default as Modal } from "react-modal";
import Image from "next/image";
import TrackDisplay from "./TrackDisplay";

Modal.setAppElement("#root");

function getTimerExpiryTimestamp(seconds: number) {
    return dayjs().add(seconds, "seconds").toDate();
}

function selectTrack(
    tracks: Track[],
    lowerLimit_perc: number,
    upperLimit_perc: number
) {
    const track = tracks[Math.floor(Math.random() * tracks.length)];
    const { duration_ms } = track;
    const lowerLimit = duration_ms * lowerLimit_perc;
    const upperLimit = duration_ms * upperLimit_perc;
    const durationRange = upperLimit - lowerLimit;
    const trackStart_ms = Math.min(
        Math.floor(Math.random() * durationRange) + lowerLimit,
        duration_ms - 10 * 1000
    );

    console.log(track);

    return { trackStart_ms, track };
}

export default function Game({
    playerObj,
}: {
    playerObj: {
        player: any;
        playerID: string;
    } | null;
}) {
    const roundTime = 10;
    const trackTime = 10;
    const lowerLimit_perc = 0;
    const upperLimit_perc = 1;

    const { player, playerID } = playerObj!;
    const game = useContext(GameContext);

    const randomlySelectedTrack = selectTrack(
        game.tracks,
        lowerLimit_perc,
        upperLimit_perc
    );

    const router = useRouter();
    const [round, setRound] = useState(1);

    const [began, setBegan] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [roundFinished, setRoundFinished] = useState(false);

    const [selectedTrack, setSelectedTrack] = useState<Track>(
        randomlySelectedTrack.track
    );
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

    function restartTrackTimer() {
        trackTimer.restart(getTimerExpiryTimestamp(trackTime), false);
        player.seek(trackStart_ms);
        player.pause();
        setIsPlaying(false);
    }

    const roundTimer = useTimer({
        expiryTimestamp: getTimerExpiryTimestamp(roundTime),
        autoStart: false,
        onExpire: () => {
            finishRound();
        },
    });

    function finishRound() {
        if (isPlaying) {
            player.pause();
            trackTimer.pause();
        }

        setRoundFinished(true);
    }

    function advanceRound() {
        const { trackStart_ms, track } = selectTrack(
            game.tracks,
            lowerLimit_perc,
            upperLimit_perc
        );

        setRound((prev) => prev + 1);

        setTrackStart_ms(trackStart_ms);
        setSelectedTrack(track);
        setGuess("");
        setIsPlaying(false);
        setRoundFinished(false);
        setBegan(false);
        roundTimer.restart(getTimerExpiryTimestamp(roundTime), false);
        trackTimer.restart(getTimerExpiryTimestamp(trackTime), false);
        player.pause();
    }

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
                    finishRound();
                }}
            >
                <AutocompleteBar guess={guess} setGuess={setGuess} />
                <button type="submit">Submit</button>
            </form>
            <Modal
                isOpen={roundFinished}
                onRequestClose={advanceRound}
                className={styles["modal__content"]}
                overlayClassName={styles["modal__overlay"]}
            >
                <h2
                    style={{
                        color:
                            selectedTrack?.guess === guess
                                ? "green"
                                : "#b91c1c",
                        gridColumn: "1 / -1",
                    }}
                >
                    {selectedTrack?.guess === guess
                        ? "Correct :)"
                        : "Incorrect :("}
                </h2>
                <Image
                    style={{
                        gridColumn: "1 / -1",
                    }}
                    alt="Album cover"
                    src={selectedTrack.album.images[0].url}
                    width={200}
                    height={200}
                />
                <TrackDisplay styles={styles} track={selectedTrack} />
                <span>Points</span>
                <button
                    className={styles["modal__close-button"]}
                    onClick={advanceRound}
                >
                    Continue
                </button>
            </Modal>
        </>
    );
}

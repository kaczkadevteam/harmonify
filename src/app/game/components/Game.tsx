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
import Button from "@/components/Button";
import CircularTimer from "./CircularTimer";
import Icon from "@mdi/react";
import { mdiPlay, mdiPause } from "@mdi/js";

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
    track.trackStart_ms = Math.min(
        Math.floor(Math.random() * durationRange) + lowerLimit,
        duration_ms - 10 * 1000
    );

    console.log(track);

    return track;
}

export default function Game({
    playerObj,
    finishGame,
}: {
    playerObj: {
        player: any;
        playerID: string;
    } | null;
    finishGame: () => void;
}) {
    const roundTime = 30;
    const trackTime = 10;
    const lowerLimit_perc = 0;
    const upperLimit_perc = 1;
    const maxRounds = 10;

    const { player, playerID } = playerObj!;
    const game = useContext(GameContext);

    const router = useRouter();
    const [round, setRound] = useState(1);

    const [began, setBegan] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [roundFinished, setRoundFinished] = useState(false);

    const [selectedTrack, setSelectedTrack] = useState<Track>(() => {
        return selectTrack(game.tracks, lowerLimit_perc, upperLimit_perc);
    });
    const [guess, setGuess] = useState("");
    const [points, setPoints] = useState(0);

    const playButtonRef = useRef<HTMLButtonElement>();

    const trackTimer = useTimer({
        expiryTimestamp: getTimerExpiryTimestamp(trackTime),
        autoStart: false,
        onExpire: () => {
            restartTrackTimer();
        },
    });

    function getPoints(seconds: number) {
        const points =
            seconds < 3
                ? 300
                : Math.floor(100 / Math.pow(seconds - 2, 1.1) + 54);

        if (selectedTrack.guess === guess) {
            return points;
        } else if (
            selectedTrack.guess?.split(" - ")?.[1] === guess.split(" - ")?.[1] // compare if the same artist
        ) {
            return Math.floor(points / 5);
        } else {
            return 0;
        }
    }

    function restartTrackTimer() {
        trackTimer.restart(getTimerExpiryTimestamp(trackTime), false);
        player.seek(selectedTrack.trackStart_ms);
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
        roundTimer.pause();

        setRoundFinished(true);
    }

    function advanceRound() {
        const track = selectTrack(
            game.tracks,
            lowerLimit_perc,
            upperLimit_perc
        );

        if (round == maxRounds) {
            game.setFinalScore(points);
            finishGame();
        }

        setPoints((v) => v + getPoints(roundTime - roundTimer.totalSeconds));
        setRound((prev) => prev + 1);

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
                        position_ms: selectedTrack.trackStart_ms,
                    })
                );
                setBegan(true);
                roundTimer.start();
            } else {
                player.resume();
            }
            playButtonRef.current?.animate(
                [{ color: "black" }, { color: "red" }],
                { duration: trackTime * 1000, iterations: Infinity }
            );
            trackTimer.resume();
        }

        setIsPlaying(!isPlaying);
    }

    const percentageOfTrackTime = Math.floor(
        ((trackTime - trackTimer.totalSeconds) / trackTime) * 100
    );

    /*backgroundImage: `linear-gradient(0.25turn, gray ${
                        percentageOfTrackTime - 1
                    }%,${percentageOfTrackTime}%, transparent)`,*/

    return (
        <div className={styles["game"]}>
            <div>
                Runda: {round} Czas muzyki: {trackTimer.totalSeconds}
            </div>
            <CircularTimer x={roundTimer.totalSeconds} xMax={roundTime} />

            <Button
                onClick={togglePlay}
                size="large"
                ref={playButtonRef}
                style={{
                    padding: "10px 60px",
                    backgroundPosition: "100% 50%",
                }}
            >
                {isPlaying ? (
                    <Icon path={mdiPause} size={3} />
                ) : (
                    <Icon path={mdiPlay} size={3} />
                )}
            </Button>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    finishRound();
                }}
            >
                <AutocompleteBar guess={guess} setGuess={setGuess} />
                <Button type="submit" size="small">
                    Submit
                </Button>
            </form>
            <Modal
                isOpen={roundFinished}
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
                <span>
                    Points:{" "}
                    {`${points} + ${getPoints(
                        roundTime - roundTimer.totalSeconds
                    )}`}
                </span>
                <Button onClick={advanceRound} size="small">
                    Continue
                </Button>
            </Modal>
        </div>
    );
}

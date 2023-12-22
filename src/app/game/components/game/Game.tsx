"use client";

import styles from "./game.module.scss";
import { useCallback, useContext, useRef } from "react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GameContext } from "../gameContext/GameContext";
import { fetchFromSpotify } from "@/fetch";
import { useRouter } from "next/navigation";
import { useTimer } from "react-timer-hook";
import dayjs from "dayjs";
import { Track } from "@/types";
import AutocompleteBar from "../autocompleteBar/AutocompleteBar";
import { default as Modal } from "react-modal";
import Image from "next/image";
import TrackDisplay from "../trackDisplay/TrackDisplay";
import Button from "@/components/button/Button";
import CircularTimer from "../circularTimer/CircularTimer";
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
    const { player, playerID } = playerObj!;
    const game = useContext(GameContext);

    const router = useRouter();
    const [round, setRound] = useState(1);

    const [began, setBegan] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [roundFinished, setRoundFinished] = useState(false);
    const [secondsPlayingTrack, setSecondsPlayingTrack] = useState(0);

    const [selectedTrack, setSelectedTrack] = useState<Track>(() => {
        return selectTrack(
            game.tracks,
            game.lowerLimit_perc,
            game.upperLimit_perc
        );
    });
    const [guess, setGuess] = useState("");
    const [points, setPoints] = useState(0);

    const playButtonRef = useRef<HTMLButtonElement>();
    const playButtonAnimation = useRef<Animation>();

    function getPoints() {
        const seconds =
            Number.parseInt(
                playButtonAnimation.current?.currentTime?.toString() ?? "0"
            ) /
                1000 +
            secondsPlayingTrack;

        console.log(seconds);
        let points;

        if (seconds === 0) {
            points = 295;
        } else if (seconds < 3) {
            points = Math.floor(-15 * Math.pow(seconds, 2) + 295);
        } else {
            points = Math.floor(100 / Math.pow(seconds - 2, 1.1) + 60);
        }

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

    const restartTrackTimer = useCallback(
        function () {
            player.seek(selectedTrack.trackStart_ms);
            player.pause();
            //playButtonAnimation.current?.finish();
            playButtonAnimation.current?.pause();
            playButtonAnimation.current!.currentTime = 0;
            setSecondsPlayingTrack(secondsPlayingTrack + game.trackTime);
            setIsPlaying(false);
        },
        [
            player,
            playButtonAnimation,
            selectedTrack,
            secondsPlayingTrack,
            game.trackTime,
        ]
    );

    const roundTimer = useTimer({
        expiryTimestamp: getTimerExpiryTimestamp(game.roundTime),
        autoStart: false,
        onExpire: () => {
            finishRound();
        },
    });

    function finishRound() {
        if (isPlaying) {
            player.pause();
            playButtonAnimation.current!.pause();
        }
        roundTimer.pause();

        setRoundFinished(true);
    }

    function advanceRound() {
        const track = selectTrack(
            game.tracks,
            game.lowerLimit_perc,
            game.upperLimit_perc
        );

        if (round == game.roundsCount) {
            game.setFinalScore(points + getPoints());
            finishGame();
        }

        setPoints((v) => v + getPoints());
        setRound((prev) => prev + 1);
        playButtonAnimation.current!.currentTime = 0;

        setSecondsPlayingTrack(0);
        setSelectedTrack(track);
        setGuess("");
        setIsPlaying(false);
        setRoundFinished(false);
        setBegan(false);
        roundTimer.restart(getTimerExpiryTimestamp(game.roundTime), false);
        player.pause();
    }

    useEffect(() => {
        function getPlayButtonAnimation() {
            const animation = playButtonRef.current?.animate(
                [
                    { backgroundPositionX: "100%" },
                    { backgroundPositionX: "0%" },
                ],
                { duration: game.trackTime * 1000, iterations: 1 }
            );

            if (animation) {
                animation.pause();
                animation.onfinish = restartTrackTimer;
            }

            return animation;
        }

        playButtonAnimation.current = getPlayButtonAnimation();
    }, [restartTrackTimer, game.trackTime]);

    async function togglePlay() {
        if (isPlaying) {
            player.pause();
            playButtonAnimation.current!.pause();
        } else {
            if (!began) {
                await fetchFromSpotify(
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
            playButtonAnimation.current?.play();
        }

        setIsPlaying(!isPlaying);
    }

    return (
        <div className={styles["game"]}>
            <div
                style={{
                    alignSelf: "start",
                    justifySelf: "start",
                    fontSize: "2.5rem",
                }}
            >
                Runda: {round}
            </div>
            <CircularTimer x={roundTimer.totalSeconds} xMax={game.roundTime} />

            <Button
                onClick={togglePlay}
                size="large"
                ref={playButtonRef}
                style={{
                    padding: "10px 60px",
                    backgroundSize: "200% 200%",
                    gridColumn: "1 / -1",
                    backgroundPositionX: "100%",
                    backgroundImage: `linear-gradient(0.25turn, #1b3162 49%
                    ,50%, transparent)`,
                }}
            >
                {isPlaying ? (
                    <Icon path={mdiPause} size={3} />
                ) : (
                    <Icon path={mdiPlay} size={3} />
                )}
            </Button>
            <form
                className={styles["game__search-form"]}
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
                {roundFinished && (
                    <>
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
                        {selectedTrack?.guess !== guess && (
                            <span style={{ gridColumn: "1 / -1" }}>
                                <span style={{ color: "#b91c1c" }}>
                                    Your guess:{" "}
                                </span>
                                <TrackDisplay styles={styles} guess={guess} />
                            </span>
                        )}
                        <span>Points: {`${points} + ${getPoints()}`}</span>
                        <Button onClick={advanceRound} size="small" autoFocus>
                            Continue
                        </Button>{" "}
                    </>
                )}
            </Modal>
        </div>
    );
}

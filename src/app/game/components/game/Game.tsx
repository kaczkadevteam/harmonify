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
import { GameData, GameResult, Track } from "@/types";
import AutocompleteBar from "../autocompleteBar/AutocompleteBar";
import { default as Modal } from "react-modal";
import Image from "next/image";
import TrackDisplay from "../trackDisplay/TrackDisplay";
import Button from "@/components/button/Button";
import CircularTimer from "../circularTimer/CircularTimer";
import Icon from "@mdi/react";
import { mdiPlay, mdiPause, mdiArrowLeft, mdiArrowRight } from "@mdi/js";
import VolumeInput from "../volumeInput/VolumeInput";

Modal.setAppElement("#root");

function getTimerExpiryTimestamp(seconds: number) {
    return dayjs().add(seconds, "seconds").toDate();
}

function selectTrack(
    tracks: Track[],
    round: number,
    lowerLimit_perc: number,
    upperLimit_perc: number,
    trackPlayDuration: number
) {
    const track = tracks[round - 1];
    const { duration_ms } = track;
    const lowerLimit = duration_ms * lowerLimit_perc;
    const upperLimit = duration_ms * upperLimit_perc;
    const durationRange = upperLimit - lowerLimit;
    track.trackStart_ms = Math.min(
        Math.floor(Math.random() * durationRange) + lowerLimit,
        duration_ms - trackPlayDuration * 1000
    );

    return track;
}

function getSavedVolume() {
    return Number.parseInt(localStorage.getItem("VOLUME") ?? "5");
}

export default function Game({
    playerObj,
    gameData,
    finishGame,
}: {
    playerObj: {
        player: any;
        playerID: string;
    } | null;
    gameData: Readonly<GameData>;
    finishGame: (gameResult: GameResult) => void;
}) {
    const { player, playerID } = playerObj!;
    const gameContext = useContext(GameContext);

    const router = useRouter();
    const [round, setRound] = useState(1);

    const [began, setBegan] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [roundFinished, setRoundFinished] = useState(false);
    const [trackPlayRepeats, setTrackPlayRepeats] = useState(0);

    const [selectedTrack, setSelectedTrack] = useState<Track>(() => {
        return selectTrack(
            gameData.selectedTracks,
            round,
            gameData.trackLowerLimit_perc,
            gameData.trackUpperLimit_perc,
            gameData.trackDuration
        );
    });
    const [guess, setGuess] = useState("");
    const [points, setPoints] = useState(0);

    const playButtonRef = useRef<HTMLButtonElement>();
    const playButtonAnimation = useRef<Animation>();

    const setVolume = useCallback(
        (volume: number) => {
            localStorage.setItem("VOLUME", volume.toString());

            player.setVolume(volume / 100);
        },
        [player]
    );

    useEffect(() => {
        setVolume(getSavedVolume());
    }, [setVolume]);

    function getPoints() {
        const seconds =
            Number.parseInt(
                playButtonAnimation.current?.currentTime?.toString() ?? "0"
            ) /
                1000 +
            trackPlayRepeats * gameData.trackDuration;

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
            playButtonAnimation.current?.pause();
            playButtonAnimation.current!.currentTime = 0;
            setTrackPlayRepeats(trackPlayRepeats + 1);
            setIsPlaying(false);
        },
        [player, playButtonAnimation, selectedTrack, trackPlayRepeats]
    );

    const roundTimer = useTimer({
        expiryTimestamp: getTimerExpiryTimestamp(gameData.roundDuration),
        autoStart: false,
        onExpire: () => {
            finishRound();
        },
    });

    function finishRound() {
        stopPlaying();
        roundTimer.pause();

        setRoundFinished(true);
    }

    function advanceRound() {
        if (round == gameData.roundCount) {
            finishGame({
                score: points + getPoints(),
                guessedTracks: [],
            });
            return;
        }
        const nextRound = round + 1;

        const track = selectTrack(
            gameData.selectedTracks,
            nextRound,
            gameData.trackLowerLimit_perc,
            gameData.trackUpperLimit_perc,
            gameData.trackDuration
        );

        setPoints((v) => v + getPoints());
        setRound(nextRound);
        playButtonAnimation.current!.currentTime = 0;

        setTrackPlayRepeats(0);
        setSelectedTrack(track);
        setGuess("");
        setIsPlaying(false);
        setRoundFinished(false);
        setBegan(false);
        roundTimer.restart(
            getTimerExpiryTimestamp(gameData.roundDuration),
            false
        );

        player.pause();
    }

    useEffect(() => {
        function getPlayButtonAnimation() {
            const animation = playButtonRef.current?.animate(
                [
                    { backgroundPositionX: "100%" },
                    { backgroundPositionX: "0%" },
                ],
                { duration: gameData.trackDuration * 1000, iterations: 1 }
            );

            if (animation) {
                animation.pause();
                animation.onfinish = restartTrackTimer;
            }

            return animation;
        }

        playButtonAnimation.current = getPlayButtonAnimation();
    }, [restartTrackTimer, gameData.trackDuration]);

    function stopPlaying() {
        player.pause();
        playButtonAnimation.current!.pause();
        setIsPlaying(false);
    }

    async function togglePlay() {
        if (isPlaying) {
            stopPlaying();
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
                <span>Round: {round}</span>
            </div>
            <div
                style={{
                    alignSelf: "start",
                    justifySelf: "end",
                    display: "flex",
                    alignItems: "center",
                    gap: "30px",
                }}
            >
                <CircularTimer
                    x={roundTimer.totalSeconds}
                    xMax={gameData.roundDuration}
                />
                <Button
                    onClick={() => {
                        finishRound();
                        finishGame({
                            score: points + getPoints(),
                            guessedTracks: [],
                        });
                    }}
                    size="small"
                    style={{
                        display: "flex",
                        fontSize: "1rem",
                        alignItems: "center",
                    }}
                >
                    End <Icon path={mdiArrowRight} size={1} />
                </Button>
            </div>

            <div className={styles["game__playback-control"]}>
                <Button
                    autoFocus
                    onClick={togglePlay}
                    size="large"
                    ref={playButtonRef}
                    style={{
                        padding: "10px 60px",
                        backgroundSize: "200% 200%",
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
                <VolumeInput
                    defaultValue={getSavedVolume()}
                    onChange={(value) => setVolume(value)}
                />
            </div>

            <form
                className={styles["game__search-form"]}
                onKeyDown={(e) => {
                    if (guess === "" && e.key === " ") {
                        e.preventDefault();
                        togglePlay();
                    }
                }}
                onSubmit={(e) => {
                    e.preventDefault();
                    if (guess === "") {
                        togglePlay();
                        return;
                    }

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

"use client";

import styles from "./finish.module.scss";
import Button from "@/components/button/Button";
import { GameResult } from "@/types";
import TrackDisplay from "../trackDisplay/TrackDisplay";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiCancel, mdiCheck, mdiClose } from "@mdi/js";

export default function Finish({
    gameResult,
    playAgain,
}: {
    gameResult: GameResult;
    playAgain: () => void;
}) {
    return (
        <div className={styles["finish"]}>
            <div className={styles["finish__tracks"]}>
                {gameResult.playedTracks.map((playedTrack) => {
                    return (
                        <div
                            key={playedTrack.track.uri}
                            className={styles["finish__played-track"]}
                        >
                            <Image
                                style={{ gridRow: "1 / -1" }}
                                alt="Album cover"
                                src={playedTrack.track.album.images[0].url}
                                width={200}
                                height={200}
                            />
                            <TrackDisplay
                                styles={styles}
                                track={playedTrack.track}
                            />
                            <div
                                className={
                                    styles["finish__played-track__result"]
                                }
                            >
                                {playedTrack.isGuessed ? (
                                    <span>
                                        <span
                                            style={{
                                                marginRight: "10px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            Time to guess:
                                        </span>
                                        <span>{playedTrack.playDuration}s</span>
                                    </span>
                                ) : playedTrack.userGuess ? (
                                    <span
                                        className={
                                            styles[
                                                "finish__played-track__result__details"
                                            ]
                                        }
                                    >
                                        <span
                                            style={{
                                                marginRight: "10px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            Your guess:
                                        </span>
                                        <span>{playedTrack.userGuess}</span>
                                    </span>
                                ) : (
                                    <span
                                        style={{
                                            marginRight: "10px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        No guess
                                    </span>
                                )}

                                {playedTrack.isGuessed ? (
                                    <Icon
                                        className={
                                            styles[
                                                "finish__played-track__result__icon"
                                            ]
                                        }
                                        color="#22c55e"
                                        path={mdiCheck}
                                        size={2}
                                    />
                                ) : (
                                    <Icon
                                        className={
                                            styles[
                                                "finish__played-track__result__icon"
                                            ]
                                        }
                                        color="#ef4444"
                                        path={mdiClose}
                                        size={2}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className={styles["finish__result"]}>
                <span className={styles["finish__score"]}>
                    Score: {gameResult.score}
                </span>
                <Button onClick={playAgain} size="large">
                    Play again?
                </Button>
            </div>
        </div>
    );
}

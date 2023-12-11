import React from "react";
import { Track } from "@/types";

export default function TrackDisplay({
    styles,
    guess,
    track,
}: {
    styles: {
        readonly [key: string]: string;
    };
    guess?: string;
    track?: Track;
}) {
    if (guess != null) {
        return (
            <span className={styles["track-display"]}>
                <span className={styles["track-display__title"]}>
                    {guess.split(" - ")[0]}
                </span>
                <span className={styles["track-display__author"]}>
                    {guess.split(" - ")[1]}
                </span>
            </span>
        );
    } else if (track) {
        return (
            <span className={styles["track-display"]}>
                <span className={styles["track-display__title"]}>
                    {track.name}
                </span>
                <span className={styles["track-display__author"]}>
                    {track.artists
                        .reduce((acc, artist) => {
                            return `${acc}, ${artist.name}`;
                        }, "")
                        .slice(2)}
                </span>
            </span>
        );
    } else {
        throw new Error("HEJ");
    }
}

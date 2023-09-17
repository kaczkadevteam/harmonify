import React from "react";
import { Track } from "@/types";

export default function TrackDisplay({
    styles,
    track,
}: {
    styles: {
        readonly [key: string]: string;
    };
    track: Track;
}) {
    return (
        <span className={styles["track-display"]}>
            <span className={styles["track-display__title"]}>{track.name}</span>
            <span className={styles["track-display__author"]}>
                {track.artists
                    .reduce((acc, artist) => {
                        return `${acc}, ${artist.name}`;
                    }, "")
                    .slice(2)}
            </span>
        </span>
    );
}

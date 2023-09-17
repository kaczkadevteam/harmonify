import { Track } from "@/types";
import React from "react";

export default function AutocompleteBarOption({
    styles,
    track,
    setGuess,
}: {
    styles: {
        readonly [key: string]: string;
    };
    track: Track;
    setGuess: (guess: string) => void;
}) {
    return (
        <div
            className={styles["autocomplete__option"]}
            onClick={() => {
                setGuess(track.guess ?? "");
            }}
        >
            <span className={styles["autocomplete__major-title"]}>
                {track.name}
            </span>
            <span className={styles["autocomplete__minor-title"]}>
                {track.artists
                    .reduce((acc, artist) => {
                        return `${acc}, ${artist.name}`;
                    }, "")
                    .slice(2)}
            </span>
        </div>
    );
}

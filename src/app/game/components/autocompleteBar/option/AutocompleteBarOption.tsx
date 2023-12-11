import { Track } from "@/types";
import React from "react";
import TrackDisplay from "../../trackDisplay/TrackDisplay";

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
            <TrackDisplay styles={styles} track={track} />
            <input type="hidden" name="track" value={track.uri} />
        </div>
    );
}

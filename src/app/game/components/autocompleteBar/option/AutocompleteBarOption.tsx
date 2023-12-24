import { Track } from "@/types";
import React, { useEffect, useRef } from "react";
import TrackDisplay from "../../trackDisplay/TrackDisplay";
import styles from "./autocompleteBarOption.module.scss";

export default function AutocompleteBarOption({
    track,
    selected,
    setGuess,
}: {
    track: Track;
    selected?: boolean;
    setGuess: (guess: string) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selected) {
            ref.current?.scrollIntoView({ block: "nearest" });
        }
    }, [selected]);

    let className = styles["autocomplete-option"];
    className += selected ? ` ${styles["autocomplete-option--selected"]}` : "";

    return (
        <div
            className={className}
            ref={ref}
            onClick={() => {
                setGuess(track.guess ?? "");
            }}
        >
            <TrackDisplay styles={styles} track={track} />
            <input type="hidden" name="track" value={track.uri} />
        </div>
    );
}

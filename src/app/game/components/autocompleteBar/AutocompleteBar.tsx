import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "./autocompleteBar.module.scss";
import { GameContext } from "../gameContext/GameContext";
import AutocompleteBarOption from "./option/AutocompleteBarOption";
import { Track } from "@/types";

export default function AutocompleteBar({
    guess,
    setGuess,
}: {
    guess: string;
    setGuess: (guess: string) => void;
}) {
    const game = useContext(GameContext);
    const [selectedTrack, setSelectedTrack] = useState<Track>();
    const [focused, setFocused] = useState(false);

    const matchingTracks = game.tracks.filter((track) => {
        if (track.guess == null) return false;
        if (guess === "") return false;
        if (track.guess === guess) return false;

        return track.guess.toLowerCase().includes(guess.toLowerCase());
    });

    if (
        selectedTrack &&
        !matchingTracks.includes(selectedTrack) &&
        matchingTracks.length !== 0
    ) {
        setSelectedTrack(matchingTracks[0]);
    }

    const handleSelectionMovement = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();

                if (selectedTrack == undefined) {
                    setSelectedTrack(matchingTracks[0]);
                } else if (
                    event.key === "ArrowDown" &&
                    selectedTrack != undefined &&
                    matchingTracks.indexOf(selectedTrack) <
                        matchingTracks.length - 1
                ) {
                    const newIndex = matchingTracks.indexOf(selectedTrack) + 1;
                    setSelectedTrack(matchingTracks[newIndex]);
                } else if (
                    event.key === "ArrowUp" &&
                    selectedTrack != undefined &&
                    matchingTracks.indexOf(selectedTrack) > 0
                ) {
                    const newIndex = matchingTracks.indexOf(selectedTrack) - 1;
                    setSelectedTrack(matchingTracks[newIndex]);
                }
            }
        },
        [selectedTrack, matchingTracks]
    );

    const handleSelectionInput = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Enter" && selectedTrack != undefined) {
                event.preventDefault();
                setGuess(selectedTrack.guess ?? "");
            }
        },
        [selectedTrack, setGuess]
    );

    useEffect(() => {
        if (matchingTracks.length > 0 && focused) {
            window.addEventListener("keydown", handleSelectionMovement);
            window.addEventListener("keydown", handleSelectionInput);

            return () => {
                window.removeEventListener("keydown", handleSelectionMovement);
                window.removeEventListener("keydown", handleSelectionInput);
            };
        }
    }, [
        matchingTracks,
        focused,
        handleSelectionMovement,
        handleSelectionInput,
    ]);

    let className = styles["autocomplete"];

    let inputClassName = styles["autocomplete__input"];
    inputClassName +=
        matchingTracks.length > 0
            ? ` ${styles["autocomplete__input--open"]}`
            : "";

    return (
        <div className={className}>
            <input
                className={inputClassName}
                type="text"
                name="track"
                value={guess}
                autoComplete="off"
                onChange={(e) => {
                    setGuess(e.target.value);
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            <div className={styles["autocomplete__options"]}>
                {matchingTracks.map((track) => (
                    <AutocompleteBarOption
                        key={track.uri}
                        selected={selectedTrack === track}
                        track={track}
                        setGuess={setGuess}
                    />
                ))}
            </div>
        </div>
    );
}

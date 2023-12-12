import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "./autocompleteBar.module.scss";
import { GameContext } from "../gameContext/GameContext";
import AutocompleteBarOption from "./option/AutocompleteBarOption";

export default function AutocompleteBar({
    guess,
    setGuess,
}: {
    guess: string;
    setGuess: (guess: string) => void;
}) {
    const game = useContext(GameContext);
    const [selectedIndex, setSelectedIndex] = useState<number>();
    const [focused, setFocused] = useState(false);

    const matchingTracks = game.tracks.filter((track) => {
        if (track.guess == null) return false;
        if (guess === "") return false;
        if (track.guess === guess) return false;

        return track.guess.toLowerCase().includes(guess.toLowerCase());
    });

    const handleSelectionMovement = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();

                if (selectedIndex == undefined) {
                    setSelectedIndex(0);
                } else if (
                    event.key === "ArrowDown" &&
                    selectedIndex != undefined &&
                    selectedIndex < matchingTracks.length - 1
                ) {
                    setSelectedIndex(selectedIndex + 1);
                } else if (
                    event.key === "ArrowUp" &&
                    selectedIndex != undefined &&
                    selectedIndex > 0
                ) {
                    setSelectedIndex(selectedIndex - 1);
                }
            }
        },
        [selectedIndex, matchingTracks]
    );

    const handleSelectionInput = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Enter" && selectedIndex != undefined) {
                event.preventDefault();
                setGuess(matchingTracks[selectedIndex].guess ?? "");
            }
        },
        [selectedIndex, matchingTracks, setGuess]
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
                {matchingTracks.map((track, index) => (
                    <AutocompleteBarOption
                        key={track.uri}
                        selected={selectedIndex === index}
                        track={track}
                        setGuess={setGuess}
                    />
                ))}
            </div>
        </div>
    );
}

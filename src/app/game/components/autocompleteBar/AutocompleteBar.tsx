import React, { useContext } from "react";
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

    return (
        <div className={styles["autocomplete"]}>
            <input
                className={styles["autocomplete__input"]}
                type="text"
                name="track"
                value={guess}
                autoComplete="off"
                onChange={(e) => {
                    setGuess(e.target.value);
                }}
            />
            <div className={styles["autocomplete__options"]}>
                {game.tracks
                    .filter((track) => {
                        if (track.guess == null) return false;
                        if (guess === "") return false;
                        if (track.guess === guess) return false;

                        return track.guess
                            .toLowerCase()
                            .includes(guess.toLowerCase());
                    })
                    .map((track) => (
                        <AutocompleteBarOption
                            key={track.uri}
                            styles={styles}
                            track={track}
                            setGuess={setGuess}
                        />
                    ))}
            </div>
        </div>
    );
}

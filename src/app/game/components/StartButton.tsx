"use client";

import { useContext } from "react";
import styles from "./startButton.module.scss";
import { GameContext } from "./GameContext";

export default function StartButton() {
    const game = useContext(GameContext);

    return (
        <button
            className={styles["start-button"]}
            onClick={() => {
                game.setPlaying(true);
            }}
        >
            Start
        </button>
    );
}

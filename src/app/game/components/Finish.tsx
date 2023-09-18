"use client";

import { useContext } from "react";
import { GameContext } from "./GameContext";
import styles from "./finish.module.scss";
import Button from "@/components/Button";

export default function Finish({ playAgain }: { playAgain: () => void }) {
    const game = useContext(GameContext);

    return (
        <div className={styles["finish"]}>
            <span className={styles["finish__score"]}>
                Score: {game.finalScore}
            </span>
            <Button onClick={playAgain} size="large">
                Play again?
            </Button>
        </div>
    );
}

import React from "react";
import LoadingCircle from "./components/loadingCircle/LoadingCircle";
import styles from "./loading.module.scss";

export default function loading() {
    return (
        <div className={styles["loading"]}>
            <span>Loading your playlists and albums</span>
            <LoadingCircle size="40px" />
        </div>
    );
}

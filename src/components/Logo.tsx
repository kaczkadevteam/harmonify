import React from "react";
import Image from "next/image";
import styles from "./logo.module.scss";
import spotifyLogo from "../../public/Spotify_Logo_RGB_White.png";

export default function Logo() {
    return <h1 className={styles.logo}>Name that tune!</h1>;
}

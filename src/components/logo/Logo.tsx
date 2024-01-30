import React from "react";
import styles from "./logo.module.scss";
import Image from "next/image";
import logo from "@/../public/logo.png";

export default function Logo() {
    return (
        <h1 className={styles.logo}>
            <Image alt="logo" src={logo} height={90} />
            <span>Name that tune!</span>
        </h1>
    );
}

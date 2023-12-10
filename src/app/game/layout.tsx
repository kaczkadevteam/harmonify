import React from "react";
import styles from "./layout.module.scss";
import Script from "next/script";

export default function layout({ children }: React.PropsWithChildren) {
    return (
        <div className={styles.layout}>
            <header className={styles.header}>Header</header>
            {children}
            <Script src="https://sdk.scdn.co/spotify-player.js" />
        </div>
    );
}

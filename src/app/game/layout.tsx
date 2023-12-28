import React from "react";
import styles from "./layout.module.scss";

export default function layout({ children }: React.PropsWithChildren) {
    return (
        <div className={styles.layout}>
            <header className={styles.header}>Header</header>
            {children}
        </div>
    );
}

import React from "react";
import styles from "./button.module.scss";

export default function Button({
    children,
    disabled,
    size,
    type,
    onClick,
}: React.PropsWithChildren<{
    onClick?: () => void;
    disabled?: boolean;
    size: "small" | "medium" | "large";
    type?: "button" | "reset" | "submit";
}>) {
    return (
        <button
            disabled={disabled}
            className={`${styles["button"]} ${styles[`button--${size}`]}`}
            onClick={onClick}
            type={type}
        >
            {children}
        </button>
    );
}

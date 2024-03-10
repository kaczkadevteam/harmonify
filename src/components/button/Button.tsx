import React, { forwardRef } from "react";
import styles from "./button.module.scss";

export default forwardRef<
    any,
    React.PropsWithChildren<{
        onClick?: () => void;
        disabled?: boolean;
        name?: string;
        value?: string;
        size: "small" | "medium" | "large";
        type?: "button" | "reset" | "submit";
        style?: React.CSSProperties;
        autoFocus?: boolean;
    }>
>(function Button(
    { children, disabled, name, value, size, type, onClick, style, autoFocus },
    ref
) {
    return (
        <button
            disabled={disabled}
            className={`${styles["button"]} ${styles[`button--${size}`]}`}
            name={name}
            value={value}
            onClick={onClick}
            type={type}
            style={style}
            ref={ref}
            autoFocus={autoFocus}
        >
            {children}
        </button>
    );
});

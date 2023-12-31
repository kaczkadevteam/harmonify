"use client";
import Image from "next/image";
import styles from "./checkableCard.module.scss";
import Icon from "@mdi/react";
import { mdiImageOff } from "@mdi/js";

export default function CheckableCard({
    id,
    title,
    imageSrc,
    iconSrc,
    imageAlt,
    checked,
    onCheck,
    onUncheck,
}: {
    id: string;
    title: string;
    imageSrc?: string;
    iconSrc?: string;
    imageAlt: string;
    checked: boolean;
    onCheck: () => void;
    onUncheck: () => void;
}) {
    let imgWrapperClass = styles["checkable-card__img-wrapper"];
    imgWrapperClass += checked
        ? ` ${styles["checkable-card__img-wrapper--checked"]}`
        : "";

    return (
        <label htmlFor={id}>
            <div className={styles["checkable-card"]}>
                <div className={imgWrapperClass}>
                    {imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            sizes="100%"
                            fill
                        />
                    ) : (
                        <div
                            className={
                                styles[
                                    "checkable-card__img-wrapper__missing-img"
                                ]
                            }
                        >
                            {iconSrc ? (
                                <Icon path={iconSrc} size={3} color="#f59e0b" />
                            ) : (
                                <Icon path={mdiImageOff} size={3} />
                            )}
                        </div>
                    )}
                </div>
                <span>{title}</span>

                <input
                    hidden
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                        if (e.target.checked) {
                            onCheck();
                        } else {
                            onUncheck();
                        }
                    }}
                />
            </div>
        </label>
    );
}

"use client";
import Image from "next/image";
import styles from "./checkableCard.module.scss";
import Icon from "@mdi/react";
import { mdiImageOff } from "@mdi/js";

export default function CheckableCard({
    id,
    title,
    imageSrc,
    imageAlt,
    checked,
    onCheck,
    onUncheck,
}: {
    id: string;
    title: string;
    imageSrc?: string;
    imageAlt: string;
    checked: boolean;
    onCheck: () => void;
    onUncheck: () => void;
}) {
    return (
        <label htmlFor={id}>
            <div className={styles["checkable-card"]}>
                <div className={styles["checkable-card__img-wrapper"]}>
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
                            <Icon path={mdiImageOff} size={3} />
                        </div>
                    )}
                </div>
                <span>{title}</span>

                <input
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

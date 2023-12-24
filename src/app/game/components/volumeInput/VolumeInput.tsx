import {
    mdiVolumeHigh,
    mdiVolumeLow,
    mdiVolumeMedium,
    mdiVolumeOff,
} from "@mdi/js";
import Icon from "@mdi/react";
import React, { useRef, useState } from "react";
import styles from "./volumeInput.module.scss";

function getVolumeIcon(volume: number) {
    if (volume === 0) {
        return mdiVolumeOff;
    } else if (volume < 25) {
        return mdiVolumeLow;
    } else if (volume < 75) {
        return mdiVolumeMedium;
    } else {
        return mdiVolumeHigh;
    }
}

export default function VolumeInput({
    style,
    defaultValue,
    onChange: _onChange,
}: {
    style?: React.CSSProperties;
    defaultValue: number;
    onChange: (v: number) => void;
}) {
    const scrollDelta = -120;
    const volumeChangeOnScrollTick = 5;

    const [icon, setIcon] = useState(() => getVolumeIcon(defaultValue));
    const [visible, setVisible] = useState(false);
    const [volume, setVolume] = useState(() => defaultValue);

    function onChange(v: number) {
        _onChange(v);
        setIcon(getVolumeIcon(v));
        setVolume(v);
    }

    let inputClassName = styles["volume-input__input"];
    inputClassName += visible
        ? ` ${styles["volume-input__input--selected"]}`
        : "";

    return (
        <div
            style={style}
            className={styles["volume-input"]}
            onWheel={(e) => {
                const volumeChange =
                    (e.deltaY / scrollDelta) * volumeChangeOnScrollTick;

                const newVolume = Math.min(
                    Math.max(volume + volumeChange, 0),
                    100
                );

                onChange(newVolume);
            }}
        >
            <div
                onClick={() => {
                    setVisible(!visible);
                }}
            >
                <Icon path={icon} className={styles["volume-input__icon"]} />
            </div>
            <div className={inputClassName}>
                <input
                    className={styles["volume-input__input__inside"]}
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={volume}
                    onChange={(e) => {
                        const value = Number.parseInt(e.target.value);

                        onChange(value);
                    }}
                />
            </div>
        </div>
    );
}

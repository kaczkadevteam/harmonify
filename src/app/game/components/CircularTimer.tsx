import React from "react";

export default function CircularTimer({
    x,
    xMax,
}: {
    x: number;
    xMax: number;
}) {
    return (
        <div
            style={{
                color: "var(--main-light-color)",
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                fontSize: "20px",
                width: "50px",
                height: "50px",
                border: "7px solid transparent",
                alignSelf: "start",
                justifySelf: "end",
                background: `linear-gradient(var(--main-dark-color), var(--main-dark-color)) content-box no-repeat,
                    conic-gradient(transparent ${Math.floor(
                        ((xMax - x) / xMax) * 100
                    )}%, 0,var(--main-light-color)) border-box`,
            }}
        >
            {x}
        </div>
    );
}

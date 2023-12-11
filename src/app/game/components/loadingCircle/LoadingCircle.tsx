import styles from "./loadingCircle.module.scss";

export default function LoadingCircle({ size }: { size: string }) {
    return (
        <div
            style={{
                width: size,
                height: size,
                border: `calc(${size} * 0.3) solid #f3f3f3`,
                borderTop: `calc(${size} * 0.3) solid #3498db`,
            }}
            className={styles["component-circle-loader"]}
        ></div>
    );
}

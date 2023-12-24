import Image from "next/image";
import styles from "./page.module.scss";
import { cookies } from "next/headers";
import spotifyLogo from "../../public/Spotify_Logo_RGB_White.png";
import Link from "next/link";
import Logo from "@/components/logo/Logo";

export const revalidate = 3600;

export default async function Home() {
    const isLogged =
        cookies().has("access_token") || cookies().has("refresh_token");
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Logo />
                <h3>
                    Guess your favorite songs from{" "}
                    <Image alt="Spotify logo" src={spotifyLogo} width={150} />
                </h3>
            </header>
            <main className={styles.main}>
                {isLogged ? (
                    <Link href={"/game"}>Play</Link>
                ) : (
                    <Link href={"/token/request"}>Connect</Link>
                )}
            </main>
        </div>
    );
}

import { SimplePlaylistObject, Track } from "@/types";
import { useContext } from "react";
import styles from "./setup.module.scss";
import PlaylistCard from "./PlaylistCard";
import { GameContext } from "./GameContext";
import { fetchFromSpotify } from "@/fetch";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import LoadingCircle from "./LoadingCircle";
import Button from "@/components/Button";

export default function Setup({
    playlists,
    playerObj,
    startGame,
}: {
    playlists: { items: SimplePlaylistObject[]; total: number };
    playerObj: {
        player: any;
        playerID: string;
    } | null;
    startGame: () => void;
}) {
    const game = useContext(GameContext);
    const router = useRouter();

    async function startGameHandler() {
        if (!playerObj) return;

        await fetchFromSpotify(
            "/me/player",
            Cookies.get("access_token") ?? "",
            router,
            false,
            "PUT",
            JSON.stringify({ device_ids: [playerObj.playerID] })
        );

        const tracks = await fetchAllTracks();

        game.setTracks(tracks);

        startGame();
    }

    async function fetchAllTracks() {
        const tracks: Track[] = (
            await Promise.all(
                game.tracksHref.map(async (trackHref) => {
                    let next = `${trackHref}?fields=next,items(is_local,track(album.images,artists(name,id),duration_ms,name,uri))&limit=10`;
                    let safeguard = 0;
                    let tracks = [];

                    while (next && safeguard < 10) {
                        const response = await fetchFromSpotify(
                            next,
                            Cookies.get("access_token") ?? "",
                            router,
                            true,
                            "GET"
                        );

                        const result = await response.json();
                        next = result.next;
                        tracks.push(...result.items);

                        safeguard++;
                    }

                    return tracks;
                })
            )
        )
            .flat()
            .filter((item) => !item.is_local)
            .map((item) => item.track);

        return tracks;
    }

    return (
        <main className={styles["main"]}>
            <div className={styles["tracks-select"]}>
                <h2>Playlists</h2>
                <div className={styles["cards-container"]}>
                    {playlists.items.map((playlist) => {
                        return (
                            <PlaylistCard
                                key={playlist.id}
                                playlist={playlist}
                            />
                        );
                    })}
                </div>
                <h2>Albums</h2>
                <div className={styles["cards-container"]}></div>
            </div>

            <div className={styles["button-wrapper"]}>
                <Button
                    disabled={!playerObj || game.tracksHref.length === 0}
                    onClick={() => {
                        startGameHandler();
                    }}
                    size="medium"
                >
                    {playerObj ? (
                        game.tracksHref.length !== 0 ? (
                            "Start game"
                        ) : (
                            "Select tracks first"
                        )
                    ) : (
                        <LoadingCircle size="15px" />
                    )}
                </Button>
            </div>
        </main>
    );
}

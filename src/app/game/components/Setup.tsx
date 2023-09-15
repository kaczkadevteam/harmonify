import { SimplePlaylistObject, Track } from "@/types";
import { useContext } from "react";
import styles from "./setup.module.scss";
import PlaylistCard from "./PlaylistCard";
import { GameContext } from "./GameContext";
import { fetchFromSpotify } from "@/fetch";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import LoadingCircle from "./LoadingCircle";

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

        const state = await playerObj.player.getCurrentState();
        if (!state) {
            await fetchFromSpotify(
                "/me/player",
                Cookies.get("access_token") ?? "",
                router,
                false,
                "PUT",
                JSON.stringify({ device_ids: [playerObj.playerID] })
            );
        }

        const tracks = await fetchAllTracks();

        game.setTracks(tracks);

        startGame();
    }

    async function fetchAllTracks() {
        const tracks: Track[] = (
            await Promise.all(
                game.tracksHref.map(async (trackHref) => {
                    let next = `${trackHref}?fields=next,items(is_local,track(artists(name,id),duration_ms,name,uri))&limit=10`;
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

        console.log(tracks);

        return tracks;
    }

    return (
        <main className={styles["main"]}>
            <aside className={styles["playlist-list"]}>
                {playlists.items.map((playlist) => {
                    return (
                        <PlaylistCard key={playlist.id} playlist={playlist} />
                    );
                })}
            </aside>
            {playerObj ? (
                <button
                    onClick={() => {
                        startGameHandler();
                    }}
                >
                    Start game
                </button>
            ) : (
                <LoadingCircle size="15px" />
            )}
        </main>
    );
}

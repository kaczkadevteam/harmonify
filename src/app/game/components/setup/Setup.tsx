import { Album, SimplePlaylistObject, Track } from "@/types";
import { useContext, useState } from "react";
import styles from "./setup.module.scss";
import PlaylistCard from "../playlistCard/PlaylistCard";
import { GameContext } from "../gameContext/GameContext";
import { fetchFromSpotify } from "@/fetch";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import LoadingCircle from "../loadingCircle/LoadingCircle";
import Button from "@/components/button/Button";
import AlbumCard from "../albumCard/AlbumCard";

export default function Setup({
    playlists,
    albums,
    playerObj,
    startGame,
}: {
    playlists: { items: SimplePlaylistObject[]; total: number };
    albums: { items: Album<Track>[]; total: number };
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
        const playlistsTracks: Track[] = (
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

        const albumsTracks: Track[] = game.selectedAlbums.reduce<Track[]>(
            (acc, album) => {
                return [...acc, ...album.tracks.items];
            },
            []
        );

        return [...playlistsTracks, ...albumsTracks];
    }

    const noTracksSelected =
        game.tracksHref.length === 0 && game.selectedAlbums.length === 0;

    return (
        <main className={styles["main"]}>
            <div className={styles["tracks-select"]}>
                <div className={styles["tracks-select__type"]}>
                    <h2 className={styles["tracks-select__header"]}>
                        Playlists
                    </h2>
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
                </div>
                <div className={styles["tracks-select__type"]}>
                    <h2 className={styles["tracks-select__header"]}>Albums</h2>
                    <div className={styles["cards-container"]}>
                        {albums.items.map((album) => {
                            return (
                                <AlbumCard
                                    key={album.id}
                                    album={album}
                                    selected={game.selectedAlbums.some(
                                        (searchedAlbum) =>
                                            searchedAlbum.id === album.id
                                    )}
                                    selectAlbum={game.selectAlbum}
                                    deselectAlbum={game.deselectAlbum}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className={styles["button-wrapper"]}>
                <Button
                    disabled={!playerObj || noTracksSelected}
                    onClick={() => {
                        startGameHandler();
                    }}
                    size="medium"
                >
                    {playerObj ? (
                        !noTracksSelected ? (
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

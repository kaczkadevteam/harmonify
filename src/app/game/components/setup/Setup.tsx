import { Album, SimplePlaylistObject, Track } from "@/types";
import { useContext } from "react";
import styles from "./setup.module.scss";
import PlaylistCard from "../playlistCard/PlaylistCard";
import { GameContext } from "../gameContext/GameContext";
import { fetchFromSpotify } from "@/fetch";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import LoadingCircle from "../loadingCircle/LoadingCircle";
import Button from "@/components/button/Button";
import AlbumCard from "../albumCard/AlbumCard";
import { trackIntoGuessString } from "@/modules/tracks";
import CheckableCard from "../checkableCard/CheckableCard";
import { mdiHeart } from "@mdi/js";

function removeDuplicatedTracks(tracks: Track[]) {
    return tracks.reduce<Track[]>((filteredTracks, track) => {
        if (!filteredTracks.some((someTrack) => someTrack.uri === track.uri)) {
            filteredTracks.push(track);
        }
        return filteredTracks;
    }, []);
}

function addGuessToTracks(tracks: Track[]) {
    return tracks.map((track) => ({
        ...track,
        guess: trackIntoGuessString(track),
    }));
}

function selectRandomlyTracks(tracks: Track[], count: number) {
    const selectedTracks: Track[] = [];
    let leftTracks = [...tracks];

    for (let i = 0; i < count; i++) {
        if (leftTracks.length === 0) {
            leftTracks = [...tracks];
        }

        const drawnIndex = Math.floor(Math.random() * leftTracks.length);
        const drawnTrack = leftTracks.splice(drawnIndex, 1)[0];
        drawnTrack.guess = trackIntoGuessString(drawnTrack);

        selectedTracks.push(drawnTrack);
    }

    return selectedTracks;
}

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

        let tracks = await fetchAllTracks();
        tracks = removeDuplicatedTracks(tracks);
        tracks = addGuessToTracks(tracks);

        game.setDrawnTracks(selectRandomlyTracks(tracks, game.roundsCount));
        game.setTracks(tracks);

        startGame();
    }

    async function fetchAllTracks() {
        const favouriteTracks: Track[] = [];

        if (game.favouritesSelected) {
            let next =
                "https://api.spotify.com/v1/me/tracks?fields=next,items(track(album.images,artists(name,id),duration_ms,name,uri))&limit=50";

            while (next) {
                const response = await fetchFromSpotify(
                    next,
                    Cookies.get("access_token") ?? "",
                    router,
                    true,
                    "GET"
                );

                const result = await response.json();
                next = result.next;
                favouriteTracks.push(
                    ...result.items
                        .map(
                            (it: { added_at: string; track: Track }) => it.track
                        )
                        .filter(
                            (t: Track & { is_local: boolean }) => !t.is_local
                        )
                );
            }
        }

        const playlistsTracks: Track[] = (
            await Promise.all(
                game.tracksHref.map(async (trackHref) => {
                    let next = `${trackHref}?fields=next,items(is_local,track(album(name,images),artists(name,id),duration_ms,name,uri))&limit=50`;
                    let tracks = [];

                    while (next) {
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

        return [...favouriteTracks, ...playlistsTracks, ...albumsTracks];
    }

    const noTracksSelected =
        game.tracksHref.length === 0 &&
        game.selectedAlbums.length === 0 &&
        !game.favouritesSelected;

    return (
        <main className={styles["main"]}>
            <div className={styles["tracks-select"]}>
                <div className={styles["tracks-select__type"]}>
                    <h2 className={styles["tracks-select__header"]}>
                        Playlists
                    </h2>
                    <div className={styles["cards-container"]}>
                        <CheckableCard
                            id="favourites"
                            title="Favourites"
                            iconSrc={mdiHeart}
                            imageAlt="Favourites"
                            checked={game.favouritesSelected}
                            onCheck={() => game.setFavouritesSelected(true)}
                            onUncheck={() => game.setFavouritesSelected(false)}
                        />
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

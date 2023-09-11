"use client";

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: any;
        Spotify: any;
    }
}

import { useContext } from "react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GameContext } from "./GameContext";
import { fetchFromSpotify } from "@/fetch";
import { useRouter } from "next/navigation";

interface Track {
    artists: { name: string; id: string }[];
    duration_ms: number;
    name: string;
    uri: string;
}
//artists(name,id),duration_ms,name,uri)
export default function Game() {
    const router = useRouter();
    const game = useContext(GameContext);
    const [player, setPlayer] = useState<any>(null);
    const [playerID, setPlayerID] = useState<string | null>(null);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [round, setRound] = useState(1);
    const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
    const [began, setBegan] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    function setupRound(tracks: Track[]) {
        setRound((prev) => prev + 1);

        const selectedTrack = Math.floor(Math.random() * tracks.length);
        setSelectedTrack(tracks[selectedTrack].uri);
    }

    async function togglePlay() {
        if (isPlaying) {
            player.pause();
        } else {
            if (!began) {
                fetchFromSpotify(
                    "/me/player/play",
                    Cookies.get("access_token") ?? "",
                    router,
                    false,
                    "PUT",
                    JSON.stringify({ uris: [selectedTrack] })
                );
                setBegan(true);
            } else {
                player.resume();
            }
        }

        setIsPlaying(!isPlaying);
    }

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: "Web Playback SDK",
                getOAuthToken: (cb: any) => {
                    cb(Cookies.get("access_token"));
                },
                volume: 0.05,
            });

            setPlayer(player);

            player.addListener("ready", ({ device_id }: any) => {
                setPlayerID(device_id);
                console.log("Ready with Device ID", device_id);
            });

            player.addListener("not_ready", ({ device_id }: any) => {
                console.log("Device ID has gone offline", device_id);
            });

            player.setName("Name that tune!");

            player.connect();
        };
    }, []);

    useEffect(() => {
        let ignore = false;

        async function startGame() {
            if (ignore) return;

            const state = await player.getCurrentState();
            if (!state) {
                await fetchFromSpotify(
                    "/me/player",
                    Cookies.get("access_token") ?? "",
                    router,
                    false,
                    "PUT",
                    JSON.stringify({ device_ids: [playerID] })
                );
            }

            if (ignore) return;
            const tracks = await fetchAllTracks();

            if (ignore) return;
            setTracks(tracks);

            setupRound(tracks);
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

        if (game.playing && !!playerID) {
            startGame();
        }

        return () => {
            ignore = true;
        };
    }, [game, player, playerID, router]);

    if (game.playing && !!playerID) {
        return (
            <button onClick={togglePlay}>{isPlaying ? "STOP" : "START"}</button>
        );
    } else {
        return <></>;
    }
}

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

async function fetchAllTracks(tracksHref: string[], router: any) {
    const tracks = (
        await Promise.all(
            tracksHref.map(async (trackHref) => {
                let next = `${trackHref}?fields=next,items(is_local,track(artists,duration_ms,name,uri))&limit=10`;
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
}

async function startGame(
    player: any,
    player_id: string,
    router: any,
    tracksHref: string[]
) {
    const state = await player.getCurrentState();
    if (!state && false) {
        await fetchFromSpotify(
            "/me/player",
            Cookies.get("access_token") ?? "",
            router,
            false,
            "PUT",
            JSON.stringify({ device_ids: [player_id] })
        );
    }

    await fetchAllTracks(tracksHref, router);
}

export default function Game() {
    const game = useContext(GameContext);
    const [player, setPlayer] = useState<any>(null);
    const [playerID, setPlayerID] = useState<string | null>(null);
    const router = useRouter();

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
        if (game.playing && !!playerID) {
            startGame(player, playerID, router, game.tracksHref);
        }
    }, [game, player, playerID, router]);

    if (game.playing && !!playerID) {
        return <>Giam</>;
    } else {
        return <></>;
    }
}

import { useContext, useEffect, useState } from "react";
import { GameContext } from "./GameContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function useSpotifyPlayer() {
    const [playerObj, setPlayerObj] = useState<{
        player: any;
        playerID: string;
    } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: "Name that tune!",
                getOAuthToken: (cb: any) => {
                    if (!Cookies.get("access_token")) {
                        router.push("/token/refresh");
                    }
                    cb(Cookies.get("access_token"));
                },
                volume: 0.05,
            });

            player.addListener("ready", ({ device_id }: any) => {
                setPlayerObj({ player, playerID: device_id });

                console.log("Ready with Device ID", device_id);
            });

            player.addListener("not_ready", ({ device_id }: any) => {
                console.log("Device ID has gone offline", device_id);
            });

            player.connect();
        };
    }, [router]);

    return playerObj;
}

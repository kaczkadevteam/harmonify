import { Track } from "@/types";

export function trackIntoGuessString(track: Track) {
    return `${track.name} - ${track.artists
        .reduce((acc, artist) => {
            return `${acc}, ${artist.name}`;
        }, "")
        .slice(2)}`;
}

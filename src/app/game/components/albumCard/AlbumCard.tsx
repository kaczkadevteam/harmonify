"use client";

import { Album, Track } from "@/types";
import CheckableCard from "../checkableCard/CheckableCard";

export default function AlbumCard({
    album,
    selected,
    selectAlbum,
    deselectAlbum,
}: {
    album: Album<Track>;
    selected: boolean;
    selectAlbum: (album: Album<Track>) => void;
    deselectAlbum: (album: Album<Track>) => void;
}) {
    const { url: imageUrl } = album.images[0];

    return (
        <CheckableCard
            id={album.id}
            title={album.name}
            imageSrc={imageUrl}
            imageAlt="Playlist cover"
            checked={selected}
            onCheck={() => selectAlbum(album)}
            onUncheck={() => deselectAlbum(album)}
        />
    );
}

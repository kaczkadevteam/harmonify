export type SimplePlaylistObject = {
    id: string;
    images: ImageObject[];
    name: string;
    tracks: {
        href: string;
        total: number;
    };
};

export type ImageObject = {
    url: string;
    height?: number;
    width?: number;
};

export interface Track {
    album: { images: ImageObject[] };
    artists: { name: string; id: string }[];
    duration_ms: number;
    name: string;
    uri: string;
    guess?: string;
}

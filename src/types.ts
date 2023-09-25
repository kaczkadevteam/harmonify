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

export type Track = SimplifiedTrackObject & {
    album: { images: ImageObject[] };
    guess?: string;
    trackStart_ms?: number;
};

export interface SimplifiedTrackObject {
    artists: { name: string; id: string }[];
    duration_ms: number;
    name: string;
    uri: string;
}

export interface Album<T> {
    id: string;
    images: ImageObject[];
    name: string;
    tracks: {
        items: T[];
    };
}

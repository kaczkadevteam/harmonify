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

import { redirect } from "next/navigation";

export async function fetchFromSpotify(url: string, access_token: string) {
    const response = await fetch(`${process.env.SPOTIFY_URL}${url}`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (response.status === 401) {
        const result = await response.json();
        console.log(result);
        redirect("/token/expired");
    }

    return response;
}

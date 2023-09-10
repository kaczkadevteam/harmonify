import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export async function fetchFromSpotify(
    url: string,
    access_token: string,
    router: any | null = null,
    isURLFull: boolean = false,
    method = "GET",
    body: string | undefined = undefined
) {
    const response = await fetch(
        isURLFull ? url : `${process.env.NEXT_PUBLIC_SPOTIFY_URL}${url}`,
        {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body,
        }
    );

    if (response.status === 401) {
        if (router === null) {
            const result = await response.json();
            console.log(result);
            redirect("/token/expired");
        } else {
            const result = await response.json();
            console.log(result);
            router.push("/token/expired");
        }
    }

    return response;
}

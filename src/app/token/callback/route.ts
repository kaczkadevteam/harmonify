import { NextRequest, NextResponse } from "next/server";
import queryString from "query-string";
import { getResponseWithCookies } from "../tokenCookies";

const redirectCallback = "/token/callback";

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const state = params.get("state");

    if (state === null) {
        return NextResponse.redirect(new URL("/", request.url));
    } else if (state !== process.env.STATE) {
        return new Response(
            "Authorization failed, there is possibility you've been hacked!",
            {
                status: 401,
            }
        );
    }

    const code = params.get("code");

    if (code) {
        const spotifyResponse = await fetch(
            "https://accounts.spotify.com/api/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${Buffer.from(
                        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
                    ).toString("base64")}`,
                },
                body: queryString.stringify({
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: new URL(
                        redirectCallback,
                        request.url
                    ).toString(),
                }),
            }
        );
        const { access_token, refresh_token, expires_in } =
            await spotifyResponse.json();

        return getResponseWithCookies(
            new URL("/", request.url),
            access_token,
            refresh_token,
            expires_in
        );
    } else {
        return new Response(params.get("error"), {
            status: 401,
        });
    }
}

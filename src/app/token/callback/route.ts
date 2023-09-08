import { NextRequest, NextResponse } from "next/server";
import queryString from "query-string";

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
        const result = await spotifyResponse.json();

        const response = NextResponse.redirect(new URL("/", request.url));
        response.cookies.set("access_token", result.access_token, {
            httpOnly: true,
            maxAge: result.expires_in,
        });
        response.cookies.set("refresh_token", result.refresh_token, {
            httpOnly: true,
            maxAge: result.expires_in * 24 * 365,
        });

        return response;
    } else {
        return new Response(params.get("error"), {
            status: 401,
        });
    }
}

import { NextRequest, NextResponse } from "next/server";
import queryString from "query-string";
import { getResponseWithCookies } from "../tokenCookies";

export async function GET(request: NextRequest) {
    const refresh_token = request.cookies.get("refresh_token")?.value;

    if (!refresh_token)
        return NextResponse.redirect(new URL("/token/request", request.url));

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
                grant_type: "refresh_token",
                refresh_token,
            }),
        }
    );
    const { access_token, expires_in } = await spotifyResponse.json();

    return getResponseWithCookies(
        new URL("/", request.url),
        access_token,
        refresh_token,
        expires_in
    );
}

import { NextRequest, NextResponse } from "next/server";
import queryString from "query-string";

export async function GET(request: NextRequest) {
    const refresh_token = request.cookies.get("refresh_token")!.value;

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
    const result = await spotifyResponse.json();

    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("access_token", result.access_token, {
        httpOnly: true,
        maxAge: result.expires_in,
    });
    response.cookies.set("refresh_token", refresh_token, {
        httpOnly: true,
        maxAge: result.expires_in * 24 * 365,
    });

    return response;
}

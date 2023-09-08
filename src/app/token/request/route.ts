import { NextResponse } from "next/server";
import queryString from "query-string";

const redirectCallback = "/token/callback";

export async function GET(request: Request) {
    return NextResponse.redirect(
        queryString.stringifyUrl({
            url: "https://accounts.spotify.com/authorize?",
            query: {
                response_type: "code",
                client_id: process.env.CLIENT_ID,
                scope: process.env.SCOPE,
                redirect_uri: new URL(redirectCallback, request.url).toString(),
                state: process.env.STATE,
            },
        })
    );
}

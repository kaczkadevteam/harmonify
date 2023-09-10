import { NextResponse } from "next/server";

export function getResponseWithCookies(
    url: URL,
    access_token: string,
    refresh_token: string,
    expires_in: number
) {
    const response = NextResponse.redirect(url);
    response.cookies.set("access_token", access_token, {
        maxAge: expires_in - 600,
    });
    response.cookies.set("refresh_token", refresh_token, {
        httpOnly: true,
        maxAge: expires_in,
    });
    return response;
}

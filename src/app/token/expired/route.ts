import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const response = NextResponse.redirect(
        new URL("/token/request", request.url)
    );
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
}

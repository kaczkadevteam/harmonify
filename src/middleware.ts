import { NextRequest, NextResponse } from "next/server";

const redirectToRefresh = "/token/refresh";
const redirectNoTokens = "/token/request";

export function middleware(request: NextRequest) {
    if (request.cookies.has("access_token")) {
        return NextResponse.next();
    } else {
        const refresh_token = request.cookies.get("refresh_token")?.value;
        if (refresh_token) {
            return NextResponse.redirect(
                new URL(redirectToRefresh, request.url)
            );
        } else {
            return NextResponse.redirect(
                new URL(redirectNoTokens, request.url)
            );
        }
    }
}

export const config = {
    matcher: ["/((?!token|_next/static|_next/image|favicon.ico).*)"],
};

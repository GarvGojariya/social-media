import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose"


export async function middleware(req:NextRequest ) {
    const token = await req.cookies.get("accessToken")
    // console.log(token)
    try {
        const path = req.nextUrl?.pathname;
        const token = req.cookies?.get("refreshToken")?.value;
        if (token) {
            const { payload: decodedToken } = await jose.jwtVerify(
                token,
                new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET)
            );
            const user = {
                id: decodedToken.id,
                email: decodedToken.email,
            };
            const response = NextResponse.next();
            response.headers.set("x-user-id", user.id as string);
            response.headers.set("x-user-email", user.email as string);
            const isPublicPath =
                path == "/signin" ||
                path == "/signup" ||
                path == "/verify" ||
                path == "/verify/";
            if (isPublicPath && token) {
                return NextResponse.redirect(new URL("/", req.nextUrl));
            }
            if (!isPublicPath && !token) {
                return NextResponse.redirect(new URL("/user/login", req.nextUrl));
            }
            return response;
        }
    } catch (error) {

    }
}
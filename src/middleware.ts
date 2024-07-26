import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { API } from "./app/lib/axios";

export async function middleware(req: NextRequest) {
    try {
        const path = req.nextUrl.pathname;
        const isPublicPath = ["/login", "/register", "/verify"].some((publicPath) =>
            path.startsWith(publicPath)
        );
        const accessToken = req.cookies.get("accessToken")?.value;
        const refreshToken = req.cookies.get("refreshToken")?.value;

        if (accessToken) {
            try {
                const { payload: decodedToken } = await jose.jwtVerify(
                    accessToken,
                    new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET)
                );
                const user = {
                    id: decodedToken.id,
                    email: decodedToken.email,
                };

                const response = NextResponse.next();
                // response.headers.set("x-user-id", user.id as string);
                // response.headers.set("x-user-email", user.email as string);
                if (isPublicPath) {
                    return NextResponse.redirect(new URL("/", req.nextUrl));
                }
                return response;
            } catch (error: any) {
                if (error.code === "ERR_JWT_EXPIRED") {
                    try {
                        const res = await API.post("/api/user/refresh-token", { refreshToken });
                        const newAccessToken = res.data.accessToken;

                        const response = NextResponse.redirect(new URL(req.nextUrl.pathname, req.nextUrl));
                        response.cookies.set("accessToken", newAccessToken, {
                            httpOnly: true,
                            secure: true,
                            path: '/',
                        });

                        return response;
                    } catch (err) {
                        console.error("Failed to refresh token:", err);
                        const response = NextResponse.redirect(new URL("/login", req.nextUrl));
                        response.cookies.delete("accessToken");
                        response.cookies.delete("refreshToken");
                        return response;
                    }
                } else {
                    const response = NextResponse.redirect(new URL("/login", req.nextUrl));
                    response.cookies.delete("accessToken");
                    response.cookies.delete("refreshToken");
                    return response;
                }
            }
        } else if (refreshToken) {
            try {
                const res = await API.post("/api/user/refresh-token", { refreshToken });
                const newAccessToken = res.data.accessToken;

                const response = NextResponse.redirect(new URL(req.nextUrl.pathname, req.nextUrl));
                response.cookies.set("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: true,
                    path: '/',
                });

                return response;
            } catch (err) {
                console.error("Failed to refresh token:", err);
                const response = NextResponse.redirect(new URL("/login", req.nextUrl));
                response.cookies.delete("accessToken");
                response.cookies.delete("refreshToken");
                return response;
            }
        } else {
            if (!isPublicPath) {
                return NextResponse.redirect(new URL("/login", req.nextUrl));
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
}

export const config = {
    matcher: ["/", "/login", "/register", "/verify/:path*","/profile/:path*"],
};

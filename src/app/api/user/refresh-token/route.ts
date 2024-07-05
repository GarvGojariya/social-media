import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose"
import connectDatabase, { prisma } from "../../../../../utils/db";
import { generateAccessToken } from "../../../../../utils/generateTokens";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, res: NextResponse) {
    // const refreshToken = await req.cookies.get("refreshToken")?.value 

    // const accessToken = await req.cookies.get("accessToken")?.value
    const { refreshToken, accessToken } = await req.json()
    // if (!accessToken) {
    if (refreshToken) {
        const { payload: decodedToken } = await jose.jwtVerify(refreshToken, new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET))
        if (decodedToken && decodedToken.id) {
            await connectDatabase()
            const user = await prisma.user.findUnique({
                where: {
                    id: decodedToken.id as string
                },
                omit: {
                    password: true,
                }
            })

            if (!user) {
                return NextResponse.json({
                    error: "Token is invalid"
                }, {
                    status: 401
                })
            } else {
                if (user.refreshToken == refreshToken) {
                    const newAccessToken = await generateAccessToken({
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    })
                    return NextResponse.json({
                        message: "Token is refreshed",
                        accessToken: newAccessToken
                    }, {
                        status: 200
                    })
                } else {
                    return NextResponse.json({
                        error: "Token is invalid"
                    }, {
                        status: 401
                    })
                }
            }
        } else {
            return NextResponse.json({
                error: "Invalid Refresh Token"
            }, {
                status: 401
            })
        }
    } else {
        return NextResponse.json({
            error: "You are not logged in yet"
        }, {
            status: 401
        })
    }
    // } else {
    // return NextResponse.json({})
    // }
}
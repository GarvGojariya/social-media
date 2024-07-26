import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../utils/db";
import * as jose from "jose"
import { verifyToken } from "../../../../../utils/verifyToken";

export async function POST(req: NextRequest) {
    const token = await cookies().get("accessToken")
    const { url, caption } = await req.json()
    if (token) {
        try {
            const decodedToken = await verifyToken()
            if (decodedToken && decodedToken.id) {
                const post = await prisma.post.create({
                    data: {
                        url,
                        caption,
                        ownerId: decodedToken.id as string
                    }
                })
                return NextResponse.json({
                    message: "Post created successfully",
                })
            } else {
                return NextResponse.json({
                    message: "Invalid token",
                }, {
                    status: 401
                })
            }
        } catch (error) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 })
        }
    } else {
        return NextResponse.json({ message: "You are not authorized for this action" }, { status: 401 })
    }

}
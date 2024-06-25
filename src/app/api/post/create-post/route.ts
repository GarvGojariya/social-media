import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "../../../../../utils/db";
import * as jose from "jose"

export async function POST(req: NextResponse) {
    const token = await cookies().get("accessToken")
    const { url, caption } = await req.json()
    if (token) {
        try {
            const { payload: decodedToken } = await jose.jwtVerify(token.value, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET))
            if (decodedToken.id) {
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
            }
        } catch (error) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 })
        }
    } else {
        return NextResponse.json({ message: "You are not authorized for this action" }, { status: 401 })
    }

}
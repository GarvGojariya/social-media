import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose"
import { prisma } from "../../../../../utils/db";

export async function POST(req: NextRequest) {
    const { username, name, profileImage, birthDate, bio } = await req.json();
    const token = await cookies().get("accessToken")
    try {
        if (token) {
            const { payload: decodedToken } = await jose.jwtVerify(token.value, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET))
            if (decodedToken?.id) {
                const user = await prisma.user.findFirst({
                    where: {
                        id: decodedToken.id
                    }
                })
                if (!user) {
                    return NextResponse.json({ message: "User not found" }, { status: 404 })
                } else {
                    await prisma.user.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            userName: username ?? user.userName,
                            name: name ?? user.name,
                            profileImage: profileImage ?? user.profileImage,
                            birthDate: birthDate ?? user.birthDate,
                            bio: bio ?? user.bio
                        }
                    })
                    return NextResponse.json({ message: "User updated successfully" }, { status: 200 })
                }
            }
        } else {
            return NextResponse.json({
                error: "You are not authorized for this action"
            }, { status: 401 })
        }
    } catch (error) {
        return NextResponse.json({
            error: "Something went wrong"
        }, { status: 500 })
    }
}
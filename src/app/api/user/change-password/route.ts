import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose"
import { prisma } from "../../../../../utils/db";
import { isPasswordCorrect } from "../../../../../utils/auth";

export async function POST(req: NextRequest) {
    const { currentPassword, newPassword } = await req.json()
    const token = await cookies().get("accessToken")
    if (currentPassword == newPassword) {
        return NextResponse.json({
            error: "New password cannot be the same as the current password"
        }, {
            status: 400
        })
    }
    if (token) {
        try {
            const { payload: decodedToken } = await jose.jwtVerify(token.value, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET))
            if (decodedToken.id) {
                const user = await prisma.user.findFirst({
                    where: {
                        id: decodedToken.id
                    }
                })
                if (!user) {    
                    return NextResponse.json({ error: "User not found" }, { status: 404 })
                }
                if (user) {
                    const matchPassword = await isPasswordCorrect({ password: currentPassword, dbPassword: user.password })
                    if (!matchPassword) {
                        return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
                    } else {
                        await prisma.user.update({
                            where: {
                                id: user.id
                            },
                            data: {
                                password: newPassword
                            }
                        })
                        return NextResponse.json({
                            message: "Password updated successfully",
                        }, { status: 200 })
                    }
                }
            }
        } catch (error) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 })
        }
    } else {
        return NextResponse.json({ message: "You are not authorized for this action" }, { status: 401 })
    }
}
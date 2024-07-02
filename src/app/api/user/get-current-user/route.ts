import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../../../utils/verifyToken";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";

export async function GET(req: NextRequest) {
    const decodedToken = await verifyToken()
    if (decodedToken && decodedToken.id) {
        try {
            await connectDatabase()
            const user = await prisma.user.findUnique({
                where: {
                    id: decodedToken.id
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profileImage: true,
                    bio: true,
                    posts: true,
                    _count: {
                        select: {
                            followers: true,
                            following: true,
                            posts: true
                        }
                    }
                }
            })
            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 })
            } else {
                return NextResponse.json({
                    message: "Current user details fetched successfully",
                    user
                }, {
                    status: 200
                })
            }
        } catch (error) {
            return NextResponse.json({ message: "Error fetching data" }, { status: 500 })
        }
    } else {
        return NextResponse.json({
            message: "You are not authorized for this action please login first."
        }, {
            status: 401
        })
    }
}
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose"
import connectDatabase, { prisma } from "../../../../../utils/db";
import { verifyToken } from "../../../../../utils/verifyToken";

export async function GET(req: NextRequest) {
    const token = await cookies().get("accessToken")
    if (token) {
        const decodedToken = await verifyToken()
        if (decodedToken && decodedToken.id) {
            try {
                await connectDatabase()
                const user = await prisma.user.findUnique({
                    where: {
                        id: decodedToken.id as string
                    },
                    include: {
                        savedPosts: {
                            include: {
                                post: {
                                    include: {
                                        likes: true,
                                        comments: true
                                    }
                                }
                            }
                        }
                    }
                })
                if (user) {
                    return NextResponse.json(user.savedPosts.map((savedPost) => savedPost.post))
                } else {
                    return NextResponse.json({
                        error: "User not found"
                    }, {
                        status: 404
                    })
                }
            } catch (error) {
                return NextResponse.json({
                    error: "Internal Server Error"
                }, {
                    status: 500
                })
            }
        }

    } else {
        return NextResponse.json({
            message: "you are not authorized for this action please login first."
        }, {
            status: 401
        })
    }
}
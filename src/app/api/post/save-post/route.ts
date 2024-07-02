import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../../../utils/verifyToken";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";

export async function POST(req: NextRequest) {
    const decodedToken = await verifyToken()
    const params = await req.nextUrl.searchParams
    const postId = await params.get("postId")
    if (!postId) {
        return NextResponse.json({
            error: "Invalid request paramteres"
        }, {
            status: 400
        })
    }
    try {
        if (decodedToken && decodedToken.id) {
            await connectDatabase()
            const user = await prisma.user.findUnique({
                where: {
                    id: decodedToken.id
                }
            })
            if (!user) {
                return NextResponse.json({
                    error: "User wih this userId not found"
                }, {
                    status: 404
                })
            }
            const alreadySavedPost = await prisma.savedPost.findUnique({
                where: {
                    ownerId_postId: {
                        ownerId: decodedToken.id,
                        postId: postId
                    }
                }
            })
            if (alreadySavedPost) {
                await prisma.savedPost.delete({
                    where: {
                        ownerId_postId: {
                            ownerId: decodedToken.id,
                            postId: postId
                        }
                    }
                })
                return NextResponse.json({
                    message: "Post unsaved"
                }, {
                    status: 200
                })
            } else {
                await prisma.savedPost.create({
                    data: {
                        ownerId: decodedToken.id,
                        postId: postId
                    }
                })
                return NextResponse.json({
                    message: "Post saved"
                }, {
                    status: 200
                })
            }
        } else {
            return NextResponse.json({
                error: "You are not authorized for this action please login first"
            }, {
                status: 401
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
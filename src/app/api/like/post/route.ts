import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";
import { verifyToken } from "../../../../../utils/verifyToken";
import { getPostDetails } from "../../../../../utils/dbHelpers/dbHelpers";

export async function POST(req: NextRequest) {
    const params = req.nextUrl.searchParams
    const postId = await params.get('postId')
    const decodedToken = await verifyToken()
    if (!postId) {
        return NextResponse.json({
            message: "Invalid parameters"
        }, {
            status: 400
        })
    }
    if (decodedToken && decodedToken.id) {
        try {
            await connectDatabase()
            const existingPost = await getPostDetails(postId)
            if (!existingPost) {
                return NextResponse.json({
                    message: "Post not found"
                }, {
                    status: 404
                })
            }
            const alreadyLiked = await prisma.like.findFirst({
                where: {
                    ownerId: decodedToken.id,
                    postId: postId
                }
            })
            if (alreadyLiked) {
                await prisma.like.delete({
                    where: {
                        id: alreadyLiked.id,
                    },
                })
                const post = await getPostDetails(postId)
                return NextResponse.json({
                    message: "Post disliked successfully",
                    post,
                }, {
                    status: 200
                })
            } else {
                await prisma.like.create({
                    data: {
                        ownerId: decodedToken.id,
                        postId: postId,
                    }
                })
                const post = await getPostDetails(postId)
                return NextResponse.json({
                    message: "Post liked successfully",
                    post,
                }, {
                    status: 200
                })
            }
        } catch (error) {
            return NextResponse.json({
                message: "Error occure liking post"
            }, {
                status: 500
            })
        }
    } else {
        return NextResponse.json({
            message: "You are not authorized for this action please login first"
        }, {
            status: 401
        })
    }
}
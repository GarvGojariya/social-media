import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";
import { verifyToken } from "../../../../../utils/verifyToken";

export async function GET(req: NextRequest) {
    const decodedToken = await verifyToken()
    if (!decodedToken) return NextResponse.json({
        message: "Unauthorized"
    }, {
        status:
            401
    })
    const params = req.nextUrl.searchParams
    const postId = await params.get("postId")
    const pageNo = await params.get("pageNo")
    const limit = 10
    if (!postId || !pageNo) {
        return NextResponse.json({
            message: "Invalid request parameteres"
        }, {
            status: 400
        })
    }
    try {
        await connectDatabase()
        const post = await prisma.post.findUnique({
            where: {
                id: postId
            },
            include: {
                comments: {
                    skip: (parseInt(pageNo) - 1) * limit,
                    take: limit,
                    orderBy: {
                        createdAt: "desc"
                    },
                    include: {
                        owner: {
                            select: {
                                id: true,
                                name: true,
                                userName: true,
                                profileImage: true,
                            },
                        },
                        likes: {
                            where: {
                                ownerId: decodedToken.id
                            }
                        },
                        _count: {
                            select: {
                                likes: true
                            }
                        }
                    }
                }
            }
        })
        if (!post) {
            return NextResponse.json({
                message: "Post not found"
            }, {
                status: 404
            })
        } else if (post) {
            await post.comments.map((comment: any) => {
                if (comment?.likes[0]?.ownerId === decodedToken.id) {
                    comment.isLiked = true
                    delete comment.likes
                } else {
                    comment.isLiked = false
                    delete comment.likes
                }
            })
            return NextResponse.json({
                message: "Comments fetched successfully",
                comments: post.comments
            }, {
                status: 200
            })
        } else {
            return NextResponse.json({
                message: "Internal Server occure while fetching comments"
            }, {
                status: 500
            })
        }
    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error"
        }, {
            status: 500
        })
    }
}
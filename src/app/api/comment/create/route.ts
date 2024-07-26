import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../../../utils/verifyToken";
import connectDatabase, { prisma } from "../../../../../utils/db";
import { getPostDetails } from "../../../../../utils/dbHelpers/dbHelpers";

export async function POST(req: NextRequest) {
    const params = req.nextUrl.searchParams
    const postId = await params.get('postId')
    const decodedToken = await verifyToken()
    const { text } = await req.json()
    await connectDatabase()
    if (!postId) {
        return NextResponse.json({
            error: "invalid parameters"
        }, {
            status: 400
        })
    }
    if (!text || text == "") {
        return NextResponse.json({
            error: "please fill all the required fields"
        }, {
            status: 400
        })
    }
    if (decodedToken && decodedToken.id) {
        try {
            const existingPost = await prisma.post.findUnique({
                where: {
                    id: postId
                }
            })
            if (!existingPost) {
                return NextResponse.json({
                    error: "post not found"
                }, {
                    status: 404
                })
            }
            const comment = await prisma.comment.create({
                data: {
                    text,
                    postId,
                    ownerId: decodedToken.id
                },
                include: {
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            userName: true,
                            profileImage: true
                        }
                    }
                }
            })
            const post = await getPostDetails(postId)
            return NextResponse.json({
                message: "comment created successfully",
                post,
                comment:{
                    ...comment,
                    isLiked:false,
                    _count:{
                        likes:0
                    }
                }
            }, {
                status: 201
            })
        } catch (error) {
            return NextResponse.json({
                error: "internal server error occurred while creatig commnet."
            }, {
                status: 500
            })
        }
    } else {
        return NextResponse.json({
            error: "You are not authorized for this action please login first"
        }, {
            status: 401
        })
    }
}
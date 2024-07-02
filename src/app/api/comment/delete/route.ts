import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../../../utils/verifyToken";
import connectDatabase, { prisma } from "../../../../../utils/db";
import { getPostDetails } from "../../../../../utils/dbHelpers/dbHelpers";

export async function DELETE(req: NextRequest) {
    const decodedToken = await verifyToken()
    const params = await req.nextUrl.searchParams
    const commentId = params.get("commentId")
    if (!commentId) {
        return NextResponse.json({ message: "Invalid parameteres" }, {
            status: 400
        })
    }
    await connectDatabase()
    if (decodedToken && decodedToken.id) {
        try {
            const comment = await prisma.comment.findUnique({
                where: {
                    id: commentId
                },
                include: {
                    post: true
                }
            })
            if (!comment) {
                return NextResponse.json({
                    message: "Comment not found"
                }, {
                    status: 404
                })
            }
            if (comment && comment.post && (
                decodedToken.id.toString() == comment?.ownerId ||
                decodedToken.id.toString() == comment?.post?.ownerId
            )) {
                await prisma.comment.delete({
                    where: {
                        id: commentId
                    }
                })
                const post = await getPostDetails(comment.post.id)
                return NextResponse.json({
                    message: "Comment deleted successfully",
                    post
                }, {
                    status: 200
                })
            } else {
                return NextResponse.json({
                    message: "Only comment owner or post owner can delete the comment"
                })
            }
        } catch (error) {
            NextResponse.json({
                message: "Internal Server Error"
            }, {
                status: 500
            })
        }
    } else {
        return NextResponse.json({
            message: "you are not authorized for this action"
        })
    }
}
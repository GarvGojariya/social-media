import { NextRequest, NextResponse } from "next/server"
import connectDatabase from "../../../../../utils/db"
import { prisma } from "../../../../../utils/db"
import { getPostDetails } from "../../../../../utils/dbHelpers/dbHelpers"
import { verifySession } from "../../../../../utils/verifySession"

export async function POST(req: NextRequest) {
    const params = req.nextUrl.searchParams
    const commentId = await params.get('commentId')
   const sessionCheck = await verifySession(req);
  if (!sessionCheck.authorized) return sessionCheck.response;

  const { user } = sessionCheck;
    if (!commentId) {
        return NextResponse.json({
            message: "Invalid parameters",
        })
    }
    if (user && user.id) {
        await connectDatabase()
        const existingComment = await prisma.comment.findUnique({
            where: {
                id: commentId
            }
        })
        if (!existingComment) {
            return NextResponse.json({
                message: "Comment not found",
            }, {
                status: 404
            })
        }
        const alreadyLiked = await prisma.like.findFirst({
            where: {
                commentId: commentId,
                ownerId: user.id
            }
        })
        if (alreadyLiked) {
            await prisma.like.delete({
                where: {
                    id: alreadyLiked.id
                }
            })
            const post = await getPostDetails(existingComment.postId!)
            return NextResponse.json({
                message: "Comment disliked successfully",
                post
            }, {
                status: 200
            })
        } else {
            await prisma.like.create({
                data: {
                    ownerId: user.id,
                    commentId
                }
            })
            const post = await getPostDetails(existingComment.postId!)
            return NextResponse.json({
                message: "Comment liked successfully",
                post
            }, {
                status: 200
            })
        }
    } else {
        return NextResponse.json({
            message: "Unauthorized",
        }, {
            status: 401
        })
    }
}
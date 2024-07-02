import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "../../../../../utils/db";
import { cookies } from "next/headers";
import * as jose from "jose"
import { prisma } from "../../../../../utils/db";
import { verifyToken } from "../../../../../utils/verifyToken";
import { getPostDetails } from "../../../../../utils/dbHelpers/dbHelpers";

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const postId = await params.get("id")
    const token = await cookies().get("accessToken")
    await connectDatabase()
    if (postId) {
        if (token) {
            try {
                const decodedToken = await verifyToken()
                let isLiked;
                let isSaved;
                const post = await getPostDetails(postId)
                if (decodedToken && decodedToken.id) {
                    if (post) {
                        const liked = await prisma.like.findFirst({
                            where: {
                                ownerId: decodedToken.id as string,
                                postId: post.id
                            }
                        })
                        const saved = await prisma.savedPost.findFirst({
                            where: {
                                ownerId: decodedToken.id as string,
                                postId: post.id
                            }
                        })
                        if (liked) {
                            isLiked = true
                        } else {
                            isLiked = false
                        }
                        if (saved) {
                            isSaved = true
                        } else {
                            isSaved = false
                        }
                        const { user, ...postWithoutUser } = post;
                        const postDetail = {
                            ...postWithoutUser,
                            owner: user,
                            isLiked,
                            isSaved
                        }
                        return NextResponse.json({
                            message: 'Post detail fetched successfully',
                            data: postDetail
                        })
                    } else {
                        return NextResponse.json({
                            message: 'Post not found',
                            data: null
                        }, { status: 404 })
                    }
                } else {
                    return NextResponse.json({
                        message: 'Unauthorized',
                        data: null
                    }, {
                        status: 401
                    })
                }
            } catch (error) {
                return NextResponse.json({
                    message: 'Internal Server Error',
                }, {
                    status: 500
                })
            }

        } else {
            return NextResponse.json({
                message: 'You are not authorized for this action please login first.',
                data: null
            }, { status: 401 })
        }
    } else {
        return NextResponse.json({
            message: 'something went wrong while getting post detail',
        }, {
            status: 500
        })
    }

}
import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "../../../../../utils/db";
import { cookies } from "next/headers";
import * as jose from "jose"
import { prisma } from "../../../../../utils/db";

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const postId = params.get("id")
    const token = await cookies().get("accessToken")
    await connectDatabase()
    if (postId) {
        if (token) {
            const { payload: decodedToken } = await jose.jwtVerify(token.value, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET))
            let isLiked;
            let isSaved;
            const post = await prisma.post.findUnique({
                where: {
                    id: postId
                }
            })
            if (post) {
                const owner = await prisma.user.findUnique({
                    where: {
                        id: post.ownerId!
                    },
                    select: {
                        id: true,
                        userName: true,
                        profileImage: true,
                        name: true,
                    }
                })
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
                }
                if (saved) {
                    isSaved = true
                }
                const postDetail = {
                    post,
                    owner,
                    isLiked,
                    isSaved
                }
                return NextResponse.json({
                    message: 'Post fetched successfully',
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
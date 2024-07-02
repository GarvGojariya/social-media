import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "../../../../../../utils/db";
import { prisma } from "../../../../../../utils/db";

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams
    const postId = await params.get("postId")
    const pageNo = await params.get("pageNo")
    const limit = 20
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
                likes: {
                    skip: (parseInt(pageNo) - 1) * limit,
                    take: limit,
                    include: {
                        owner: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true,
                                userName: true
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
            return NextResponse.json({
                message: "Likes fetched successfully",
                likes: post.likes,
            }, {
                status: 200
            })
        } else {
            return NextResponse.json({
                message: "Something went wrong while fetching likes"
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
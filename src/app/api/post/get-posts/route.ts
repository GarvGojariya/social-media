import { NextRequest, NextResponse } from "next/server";
import connectDatabase, { prisma } from "../../../../../utils/db";
export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const id = params.get("id")
    await connectDatabase()
    if (id) {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        })
        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        } else {
            try {
                const posts = await prisma.post.findMany({
                    where: {
                        ownerId: id
                    },
                    include: {
                        _count:{
                            select:{
                                comments:true,
                                likes:true
                            }
                        }
                    }
                })
                if (!posts) {
                    return NextResponse.json({
                        message: "Posts not found",
                        posts: []
                    }, { status: 200 })
                } else {
                    return NextResponse.json({
                        message: "User posts fetched successfully",
                        posts: posts
                    }, { status: 200 })
                }
            } catch (error) {
                console.log(error)
                return NextResponse.json({
                    message: "Error fetching user posts"
                }, { status: 500 })
            }
        }
    } else {
        return NextResponse.json({
            message: "Invalid request"
        }, { status: 400 })
    }
}
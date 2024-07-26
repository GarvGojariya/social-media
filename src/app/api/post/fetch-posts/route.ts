import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../../../utils/verifyToken";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";

export async function GET(req: NextRequest) {
    const decodedToken = await verifyToken()
    const params = await req.nextUrl.searchParams
    const pageNo = await params.get("pageNo")
    const limit = 10
    if (!decodedToken || !decodedToken.id) {
        return NextResponse.json({
            message: "You are not loggedin yet please login first,"
        }, {
            status: 401
        })
    } else {
        try {
            const [postsData, totalPosts] = await Promise.all([
                prisma.post.findMany({
                    where: {
                        ownerId: {
                            not: decodedToken.id
                        },
                        likes: {
                            none: {
                                ownerId: decodedToken.id
                            }
                        }
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                userName: true,
                                profileImage: true,
                                name: true
                            }
                        },
                        _count: {
                            select: {
                                likes: true,
                                comments: true
                            }
                        },
                        savedPosts: {
                            where: {
                                ownerId: decodedToken.id
                            }
                        },
                        likes: {
                            where: {
                                ownerId: decodedToken.id
                            }
                        }
                    },
                    take: limit,
                    skip: (pageNo ? (parseInt(pageNo) - 1) * limit : 0),
                }),
                prisma.post.count()
            ]);

            const posts = postsData.map(post => {
                const isSaved = post.savedPosts.some(savedPost => savedPost.ownerId === decodedToken.id);
                const isLiked = post.likes.some(like => like.ownerId === decodedToken.id);

                const { user, ...rest } = post;

                return {
                    ...rest,
                    owner: user,
                    isSaved,
                    isLiked,
                    savedPosts: undefined,
                    likes: undefined,
                };
            });
            return NextResponse.json({
                message: "Posts fetched successfully.",
                posts,
                totalPosts
            });

        } catch (error: any) {
            return NextResponse.json({
                message: error.message
            }, {
                status: 500
            })
        }
    }
}
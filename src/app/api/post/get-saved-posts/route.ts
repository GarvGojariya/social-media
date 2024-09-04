import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import connectDatabase, { prisma } from "../../../../../utils/db";
import { verifyToken } from "../../../../../utils/verifyToken";

export async function GET(req: NextRequest) {
    const token = cookies().get("accessToken");
    const params = await req.nextUrl.searchParams
    const pageNo = params.get("pageNo")
    const limit = 10;

    if (!token) {
        return NextResponse.json({
            message: "You are not authorized for this action, please login first."
        }, {
            status: 401
        });
    }

    const decodedToken = await verifyToken();

    if (!decodedToken || !decodedToken.id) {
        return NextResponse.json({
            message: "Invalid or expired token."
        }, {
            status: 401
        });
    }

    try {
        await connectDatabase();

        const user = await prisma.user.findUnique({
            where: {
                id: decodedToken.id as string,
            },
            include: {
                savedPosts: {
                    include: {
                        post: {
                            include: {
                                _count: {
                                    select: {
                                        comments: true,
                                        likes: true,
                                    },
                                },
                                user: {
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
                                }
                            },
                        },
                    },
                    ...(pageNo ? { take: limit, skip: (parseInt(pageNo) - 1) * limit } : {})
                },
            },
        });
        const totalSavedPosts = await prisma.savedPost.count({
            where: {
                ownerId: decodedToken.id as string,
            },
        })

        if (!user || !user.savedPosts) {
            return NextResponse.json({
                error: "User not found"
            }, {
                status: 404
            });
        }

        // Modify savedPosts to include the post and rename user to owner
        const savedPostsWithOwner: any = user.savedPosts.map(savedPost => {
            const { user: owner, ...postRest } = savedPost.post;
            return {
                ...postRest,
                owner,
            };
        });

        await savedPostsWithOwner.map((savedPost: any) => {
            if (savedPost.likes[0]?.ownerId === decodedToken.id) {
                savedPost.isLiked = true;
                delete savedPost.likes
            } else {
                savedPost.isLiked = false;
                delete savedPost.likes
            }
        })

        return NextResponse.json({
            savedPosts: savedPostsWithOwner,
            totalPosts: totalSavedPosts
        });


    } catch (error) {
        console.error(error);
        return NextResponse.json({
            error: "Internal Server Error"
        }, {
            status: 500
        });
    }
}

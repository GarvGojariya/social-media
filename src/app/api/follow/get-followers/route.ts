import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";
import { verifyToken } from "../../../../../utils/verifyToken";

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams
    const userId = await params.get("userId")
    const pageNo = await params.get("pageNo")

    const decodedToken = await verifyToken()
    if (!decodedToken || !decodedToken.id) return NextResponse.json({ message: "Unauthorized" }, {
        status:
            401
    })

    const limit = 20;
    if (!userId || !pageNo) {
        return NextResponse.json({
            error: "Invalid parameteres"
        }, {
            status: 400
        })
    }
    // fetch data from database or API
    try {
        await connectDatabase()
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            return NextResponse.json({
                error: "User with this userId does not found"
            }, {
                status: 404
            })
        } else {
            const [detailData, totalCount] = await Promise.all([
                prisma.follows.findMany({
                    where: {
                        followingId: userId,
                    },
                    include: {
                        followedBy: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true,
                                userName: true,
                                followers: {
                                    where: {
                                        followedById: decodedToken.id,
                                    },
                                    select: {
                                        followedById: true,
                                    },
                                },
                            },
                        },
                    },
                    // skip: (parseInt(pageNo) - 1) * limit,
                    // take: limit,
                }),
                prisma.follows.count({
                    where: {
                        followingId: userId,
                    },
                }),
            ]);

            const data: any = await detailData
            await data.map((d: any) => {
                if (d.followedBy?.followers[0]?.followedById == decodedToken.id) {
                    d.followedBy.isFollowed = true
                    delete d.followedBy?.followers
                } else {
                    d.followedBy.isFollowed = false
                    delete d.followedBy?.followers
                }
            }
            )
            return NextResponse.json({
                followers: data,
                totalCount
            })
        }

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error: "Internal Server Error"
        }, {
            status: 500
        })
    }
}
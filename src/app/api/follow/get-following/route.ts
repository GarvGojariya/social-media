import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams
    const userId = await params.get("userId")
    const pageNo = await params.get("pageNo")
    const limit = 20;
    if (!userId || !pageNo) {
        return NextResponse.json({
            error: "Invalid parameteres"
        }, {
            status: 400
        })
    }
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
            const following = await prisma.follows.findMany({
                where: {
                    followedById: userId
                },
                skip: (parseInt(pageNo) - 1) * limit,
                take: limit,
                include: {
                    following: {
                        select: {
                            id: true,
                            name: true,
                            profileImage: true,
                            userName: true
                        }
                    },
                },
            })
            return NextResponse.json({
                following: following
            })
        }
    } catch (error) {
        return NextResponse.json({
            error: "Internal Server Error"
        }, {
            status: 500
        })
    }
}
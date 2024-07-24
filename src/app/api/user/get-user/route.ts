import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../../../utils/verifyToken";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams
    const userId = params.get('userId')
    const decodedToken = await verifyToken()
    if (!decodedToken) {
        return NextResponse.json({
            message: 'You are not authorized for this action please login first'
        }, {
            status:
                401
        })
    }
    if (userId) {
        try {
            await connectDatabase()
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    id: true,
                    name: true,
                    userName:true,
                    email: true,
                    profileImage: true,
                    bio: true,
                    posts: true,
                    _count: {
                        select: {
                            followers: true,
                            following: true,
                            posts: true
                        }
                    }
                }
            })
            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 })
            } else {
                var following = false;
                const follow = await prisma.follows.findUnique({
                    where: {
                        followingId_followedById: {
                            followingId: userId,
                            followedById: decodedToken.id
                        }
                    }
                })
                if (follow) {
                    following = true;
                }
                return NextResponse.json({
                    message: "User details fetched successfully",
                    data:{
                        user,
                        following
                    }
                }, {
                    status: 200
                })
            }
        } catch (error) {
            return NextResponse.json({ message: "Error fetching data" }, { status: 500 })
        }
    } else {
        return NextResponse.json({
            message: "Invalid request parameteres."
        }, {
            status: 400
        })
    }
}
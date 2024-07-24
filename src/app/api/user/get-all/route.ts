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
            success: false,
            message: "Unauthorized"
        }, {
            status: 401
        })
    } else {
        try {
            await connectDatabase()
            const users = await prisma.user.findMany({
                where: {
                    isVerified: true
                },
                take: limit,
                skip: (pageNo ? (parseInt(pageNo) - 1) * limit : 0),
                omit: {
                    password: true,
                    email: true,
                }
            })
            return NextResponse.json({
                success: true,
                users: users,
                message: "users fetched successfully"
            }, {
                status: 200
            })
        } catch (error) {
            return NextResponse.json({
                success: false,
                message: "Something went wrong while fetching users."
            }, {
                status: 500
            })
        }
    }
}
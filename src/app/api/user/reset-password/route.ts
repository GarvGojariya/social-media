import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "../../../../../utils/auth";
import dayjs from "dayjs";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";


export async function POST(req: NextRequest) {
    const { iv, encryptedData, password, confirmPassword } = await req.json()
    const token = {
        iv: iv,
        encryptedData: encryptedData,
    };
    try {
        if (password !== confirmPassword) {
            return NextResponse.json({ message: "Password and confirm password do not match" }, { status: 403 })
        }
        let decryptedContent = await decrypt(token);
        let data = JSON.parse(decryptedContent);
        const diffInMinutes = dayjs().diff(data.expireIn, "minute");
        if (diffInMinutes <= parseInt(process.env.LINK_EXPIRE_TIME!)) {
            await connectDatabase()
            if (data?.id) {
                const user = await prisma.user.findUnique({
                    where: {
                        id: data.id
                    },
                    select: {
                        id: true,
                        email: true,
                    }
                })
                if (!user) {
                    return NextResponse.json({
                        error: "User not found",
                    }, {
                        status: 404
                    })
                } else {
                    await prisma.user.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            password: password
                        }
                    })
                    return NextResponse.json({
                        message: "Password updated successfully"
                    }, {
                        status: 200
                    })
                }
            } else {
                return NextResponse.json({
                    error: "Invalid token",
                }, {
                    status: 401
                })
            }
        } else {
            return NextResponse.json({
                error: "Link has expired",
            }, {
                status: 401
            })
        }
    } catch (error) {
        return NextResponse.json({
            error: "Internal Server Error",
        }, { status: 500 })
    }
}
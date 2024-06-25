import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "../../../../../utils/auth";
import dayjs from "dayjs";
import connectDatabase, { prisma } from "../../../../../utils/db";

export async function POST(req: NextRequest) {
    const { iv, encryptedData } = await req.json()
    const token = {
        iv: iv,
        encryptedData: encryptedData,
    };
    let decryptedContent = await decrypt(token);
    let data = JSON.parse(decryptedContent);
    const diffInMinutes = dayjs().diff(data.expireIn, "minute");
    if (data.id && diffInMinutes <= parseInt(process.env.LINK_EXPIRE_TIME!)) {
        try {
            await connectDatabase()
            const user = await prisma.user.findFirst({
                where: {
                    id: data.id
                }
            })
            if (user) {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        isVerified: true
                    }
                })
                return NextResponse.json({ message: "User verified successfully" }, { status: 200 });
            } else if (!user) {
                return NextResponse.json({ message: "User not found for verification" }, { status: 404 });
            }
        } catch (error) {
            return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }
    } else if (diffInMinutes > parseInt(process.env.LINK_EXPIRE_TIME!)) {
        return NextResponse.json({ message: "Verification link has been expired" }, { status: 400 })
    }
    return NextResponse.json({});
}
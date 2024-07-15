import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";
import { generateEncryptedVarifyLink, sendEmailWithVarifyLink } from "../../../../../utils/auth";

export async function POST(req: NextRequest) {
    const { email } = await req.json()
    if (!email) {
        return NextResponse.json({
            error: "Email is required"
        }, {
            status: 400
        })
    }
    await connectDatabase()
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                email: true,
                userName: true,
                name:true
            }
        })
        if (!user) {
            return NextResponse.json({
                error: "User with this email not found"
            }, {
                status: 404
            })
        }else{
            const token = await generateEncryptedVarifyLink(user)
            const link = `${process.env.BASE_URL_FOR_WEB}/forget-password/${token.iv}/${token.encryptedData}`;
            try {
                await sendEmailWithVarifyLink(
                    user.email,
                    link,
                    "Click the following link to reset your password",
                    "Reset password"
                );
                return NextResponse.json({
                    success: true,
                    message: "Link is successfully sent to please check your email"
                }, {
                    status: 200
                })
            } catch (error) {
                return NextResponse.json({
                    success: false,
                    message: "Failed to send verification email",
                }, {
                    status: 500
                });
            }
        }
    } catch (error) {
        return NextResponse.json({
            error: "Internal Server Error"
        }, {
            status: 500
        })
    }
}
import { NextRequest, NextResponse } from 'next/server';
import connectDatabase from '../../../../../utils/db';
import { prisma } from '../../../../../utils/db';
import { generateEncryptedVarifyLink, sendEmailWithVarifyLink } from '../../../../../utils/auth';

export async function POST(req: NextRequest) {
    const { email } = await req.json()
    if (!email || email?.length == 0) {
        return NextResponse.json({
            success: false,
            message: "Email is required"
        }, {
            status: 400
        })
    }
    try {
        await connectDatabase()
        const user = await prisma.user.findFirst({
            where: {
                email: email
            },
            select: {
                id: true,
                email: true,
                name: true,
                isVerified: true,
                userName: true
            }
        })
        console.log({user})
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }
        if (user?.isVerified) {
            return NextResponse.json({
                success: true,
                message: "User already verified"
            }, {
                status: 200
            })
        } else {
            const token = await generateEncryptedVarifyLink(user);
            const link = `${process.env.BASE_URL_FOR_WEB}/verify/${token.iv}/${token.encryptedData}`;
            try {
                await sendEmailWithVarifyLink(
                    user.email,
                    link,
                    "Click the following link to complete your registration",
                    "Registration Confirmation"
                );
                return NextResponse.json({
                    success: true,
                    message: "Verification link successfully sent to your email please check.",
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
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, {
            status: 500
        })
    }
}
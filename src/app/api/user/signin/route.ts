import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db"
import { generateEncryptedVarifyLink, isPasswordCorrect, sendEmailWithVarifyLink } from "../../../../../utils/auth";
import { generateAccessToken, generateRefreshToken } from "../../../../../utils/generateTokens";
import { cookies, headers } from "next/headers";

export async function POST(req: NextRequest) {
    const { emailOrUsername, password } = await req.json()
    try {
        if (!(emailOrUsername || password)) {
            return NextResponse.json({
                error: "Please provide all the required fields",
            }, {
                status: 400
            })
        }
        await connectDatabase()
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: emailOrUsername }, { userName: emailOrUsername }]
            },
            select: {
                id: true,
                email: true,
                userName: true,
                name: true,
                profileImage: true,
                isVerified: true,
                password: true
            }
        })

        if (!user) {
            return NextResponse.json({
                error: "User with this email not found"
            }, {
                status: 404,
                statusText: "user not found"
            },
            )
        }
        const matchPassword = await isPasswordCorrect({ password, dbPassword: user.password })
        if (!matchPassword) {
            return NextResponse.json({
                error: "Password is incorrect"
            }, {
                status: 401,
                statusText: "Unauthorized"
            },
            )
        }
        if (!user.isVerified) {
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
                    message: "User updated successfully please check your email for verification",
                }, {
                    status: 200
                })
            } catch (error) {
                return NextResponse.json({
                    success: false,
                    message: "Failed to send verification email please try again.",
                }, { status: 500 });
            }
        } else if (user.isVerified && matchPassword) {
            const accessToken = await generateAccessToken(user)
            const refreshToken = await generateRefreshToken(user)

            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    refreshToken: refreshToken
                }
            })
            cookies().set("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
            });
            cookies().set("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
            });
            return NextResponse.json({
                success: true,
                message: "User logged in successfuly",
            }, { status: 200 })
        }
    } catch (error: any) {
        return NextResponse.json({
            error: error.message || "Internal Server Error",
            status: 500
        })
    }
}
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../utils/db";
import {
    generateEncryptedVarifyLink,
    sendEmailWithVarifyLink,
} from "../../../../../utils/auth";

export async function POST(req: NextRequest) {
    const { email, password, name, userName, profileImage, bio, birthDate } =
        await req.json();
    try {
        if (!email || !password || !name || !userName || !bio || !birthDate) {
            return NextResponse
                .json(
                    {
                        success: false,
                        message: "Please fill all the fields",
                    }, { status: 400 })
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { userName }],
            },
        });

        if (existingUser && existingUser.isVerified) {
            return NextResponse.json({
                success: false,
                message: "User with email or username already exists",
            }, {
                status: 400
            });
        }

        if (existingUser && !existingUser.isVerified) {
            try {
                const user = await prisma.user.update({
                    where: {
                        id: existingUser.id,
                    },
                    data: {
                        bio: bio,
                        profileImage: profileImage,
                        name: name,
                        password: password,
                        birthDate: birthDate
                    },
                });

                if (user) {
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
                            message: "Failed to send verification email",
                        }, {
                            status: 500
                        });
                    }
                }
            } catch (error) {
                return NextResponse.json({
                    success: false,
                    message: "Error occurred while creating user",
                }, {
                    status: 500
                });
            }
        }
        const newUser = await prisma.user.create({
            data: {
                name,
                userName,
                email,
                password,
                bio,
                profileImage,
                birthDate
            },
            select: {
                id: true,
                name: true,
                userName: true,
                email: true,
            },
        });

        if (newUser) {
            try {
                const token = await generateEncryptedVarifyLink(newUser);
                const link = `${process.env.BASE_URL_FOR_WEB}/verify/${token.iv}/${token.encryptedData}`;

                await sendEmailWithVarifyLink(
                    newUser.email,
                    link,
                    "Click the following link to complete your registration",
                    "Registration Confirmation"
                );
                return NextResponse.json({
                    success: true,
                    message:
                        "User created successfully. Please check your email for verification link",
                    data: newUser,
                }, {
                    status: 201
                });
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
            message: "Error occurred while creating user",
        }, {
            status: 500
        });
    }
}

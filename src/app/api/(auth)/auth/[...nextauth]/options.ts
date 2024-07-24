import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDatabase from "../../../../../../utils/db";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../../../utils/db";
import { NextResponse } from "next/server";
import { generateEncryptedVarifyLink, sendEmailWithVarifyLink } from "../../../../../../utils/auth";

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "email", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await connectDatabase();
                try {
                    const user = await prisma?.user.findFirst({
                        where: {
                            OR: [
                                { email: credentials.emailOrUsername },
                                { userName: credentials.emailOrUsername }
                            ]
                        },
                    });
                    if (!user) throw new Error("User not found");
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    if (!isValid) throw new Error("Invalid password");
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
                                status: 200,
                            })
                        } catch (error) {
                            return NextResponse.json({
                                success: false,
                                message: "Failed to send verification email",
                                status: 500,
                            });
                        }
                    }
                    return user;
                } catch (error: any) {
                    console.log({ error })
                    throw new Error(error.message);
                }
            },
        }),
    ],
    pages: {
        signIn: "/signin",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXT_AUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id?.toString();
                token.name = user.name;
                token.email = user.email;
                token.userName = user.userName;
                token.profileImage = user.profileImage;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.userName = token.userName;
                session.user.profileImage = token.profileImage;
            }
            return session;
        },
    },
};

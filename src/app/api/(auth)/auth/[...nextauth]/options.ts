import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../../../utils/db";
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
                try {
                    const user = await prisma?.user.findFirst({
                        where: {
                            OR: [
                                { email: credentials.emailOrUsername },
                                { userName: credentials.emailOrUsername }
                            ]
                        },
                    });
                    if (!user) throw new Error("User with this email or username not found");
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    if (!isValid) throw new Error("Password is incorrect");
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
                            throw new Error("Please check your email for verification link");
                        } catch (error) {
                            throw new Error("Failed to send verification email");
                        }
                    }
                    return user;
                } catch (error: any) {
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

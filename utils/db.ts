import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs"

declare global {
    var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
prisma.$use(async (params, next) => {
    if (
        params.model === "User" &&
        (params.action === "create" || params.action === "update")
    ) {
        const email = params.args.data.email;
        if (email && !emailRegex.test(email)) {
            throw new Error("Please fill a valid e-mail address");
        }
    }
    return next(params);
});

// Middleware function for password hashing
prisma.$use(async (params, next) => {
    if (
        params.model === "User" &&
        (params.action === "create" || params.action === "update")
    ) {
        const user = params.args.data;
        if (user.password) {
            const salt = await bcryptjs.genSalt(10);
            user.password = await bcryptjs.hash(user.password, salt);
        }
    }
    return next(params);
});

const connectDatabase = async (): Promise<void> => {
    try {
        await prisma.$connect();
        console.log("🚀 ~ database connected.");
    } catch (error) {
        console.error("🚀 ~ Error connecting to database:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        console.log("🚀 ~ database disconnected.");
    }
};

export default connectDatabase;

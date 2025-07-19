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

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

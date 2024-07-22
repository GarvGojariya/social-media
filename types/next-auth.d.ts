import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        id?: string;
        email?: string;
        name?: string;
        userName?: string;
        profileImage?: string;
    }
    interface Session {
        user: User & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT extends Partial<User> {}
}

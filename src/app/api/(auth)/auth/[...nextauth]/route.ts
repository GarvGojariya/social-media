import NextAuth from "next-auth/next";
import { authOptions } from "./options";

const authHandler = NextAuth(authOptions);

export async function GET(request: Request) {
  return authHandler(request);
}

export async function POST(request: Request) {
  return authHandler(request);
}
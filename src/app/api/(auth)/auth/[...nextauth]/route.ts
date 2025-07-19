import NextAuth from "next-auth/next";
import { authOptions } from "./options";
import { NextRequest } from "next/server";

const authHandler = NextAuth(authOptions);

export async function GET(request: NextRequest, { params }: { params: { nextauth: string[] } }) {
  return authHandler(request, { params });
}

export async function POST(request: NextRequest, { params }: { params: { nextauth: string[] } }) {
  return authHandler(request, { params });
}
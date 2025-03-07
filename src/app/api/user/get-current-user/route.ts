import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";
import { verifySession } from "../../../../../utils/verifySession";

export async function GET(req: NextRequest) {
  const sessionCheck = await verifySession(req);
  if (!sessionCheck.authorized) return sessionCheck.response;

  const { user } = sessionCheck;

  try {
    await connectDatabase();
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        userName: true,
        email: true,
        profileImage: true,
        bio: true,
        posts: true,
        _count: {
          select: { followers: true, following: true, posts: true },
        },
      },
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Current user details fetched successfully",
        user: userData,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import connectDatabase, { prisma } from "../../../../../utils/db";
import { verifySession } from "../../../../../utils/verifySession";

export async function POST(req: NextRequest) {
  // const token = await cookies().get("accessToken")
  const { url, caption } = await req.json();
  const sessionCheck = await verifySession(req);
  if (!sessionCheck.authorized) return sessionCheck.response;

  const { user } = sessionCheck;
  if (user) {
    try {
        if (user && user.id) {
          await connectDatabase()
        await prisma.post.create({
          data: {
            url,
            caption,
            ownerId: user.id as string,
          },
        });
        return NextResponse.json({
          message: "Post created successfully",
        });
      } else {
        return NextResponse.json(
          {
            message: "Invalid token",
          },
          {
            status: 401,
          }
        );
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } else {
    return NextResponse.json(
      { message: "You are not authorized for this action" },
      { status: 401 }
    );
  }
}

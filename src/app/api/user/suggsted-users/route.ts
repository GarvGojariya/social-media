import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";
import { verifySession } from "../../../../../utils/verifySession";

export async function POST(req: NextRequest) {
  const sessionCheck = await verifySession(req);
  if (!sessionCheck.authorized) return sessionCheck.response;

  const { user: sessionData } = sessionCheck;
  const params = await req.nextUrl.searchParams;
  const pageNo = await params.get("pageNo");
  const limit = 20;

  if (!sessionData || !sessionData.id) {
    return NextResponse.json(
      {
        message: "Invalid token",
        success: false,
      },
      {
        status: 401,
      }
    );
  } else {
    try {
      await connectDatabase();
      const user = await prisma.user.findUnique({
        where: {
          id: sessionData.id,
        },
        omit: {
          password: true,
        },
        include: {
          followers: true,
          following: true,
        },
      });
      if (!user) {
        return NextResponse.json(
          {
            message: "User not found",
            success: false,
          },
          {
            status: 404,
          }
        );
      }

      const connectedUsers = [
        ...user.followers?.map((follower) => follower.followedById),
        ...user.following?.map((following) => following.followingId),
      ];

      const suggestedUsers = await prisma.user.findMany({
        where: {
          id: {
            notIn: [sessionData.id, ...connectedUsers],
          },
          OR: [
            {
              followers: {
                some: { followedById: { in: [...connectedUsers] } },
              },
            },
            {
              following: { some: { followingId: { in: [...connectedUsers] } } },
            },
          ],
          isVerified: true,
        },
        take: limit,
        skip: (parseInt(pageNo ?? "1") - 1) * limit,
        select: {
          id: true,
          name: true,
          userName: true,
          profileImage: true,
        },
      });
      return NextResponse.json(
        {
          suggestedUsers,
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        {
          message: "Something went wrong while fetching suggestions.",
          success: false,
        },
        {
          status: 500,
        }
      );
    }
  }
}

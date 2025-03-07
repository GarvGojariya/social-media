import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";
import { verifySession } from "../../../../../utils/verifySession";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const userId = await params.get("userId");
  const pageNo = await params.get("pageNo");

  const sessionCheck = await verifySession(req);
  if (!sessionCheck.authorized) return sessionCheck.response;

  const { user } = sessionCheck;
  if (!user || !user.id)
    return NextResponse.json(
      { message: "Unauthorized" },
      {
        status: 401,
      }
    );

  const limit = 20;
  if (!userId || !pageNo) {
    return NextResponse.json(
      {
        error: "Invalid parameteres",
      },
      {
        status: 400,
      }
    );
  }
  try {
    await connectDatabase();
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return NextResponse.json(
        {
          error: "User with this userId does not found",
        },
        {
          status: 404,
        }
      );
    } else {
      const following = await prisma.follows.findMany({
        where: {
          followedById: userId,
        },
        // skip: (parseInt(pageNo) - 1) * limit,
        // take: limit,
        include: {
          following: {
            select: {
              id: true,
              name: true,
              profileImage: true,
              userName: true,
              followers: {
                where: {
                  followedById: user.id,
                },
                select: {
                  followedById: true,
                },
              },
            },
          },
        },
      });

      const data: any = await following;
      await data.map((d: any) => {
        if (d.following?.followers[0]?.followedById == user.id) {
          d.following.isFollowed = true;
          delete d.following?.followers;
        } else {
          d.following.isFollowed = false;
          delete d.following?.followers;
        }
      });

      return NextResponse.json({
        following: data,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

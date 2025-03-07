import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";
import { verifySession } from "../../../../../utils/verifySession";

export async function POST(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const opponentId = await params.get("opponentId");
  const sessionCheck = await verifySession(req);
  if (!sessionCheck.authorized) return sessionCheck.response;

  const { user: sessionData } = sessionCheck;
  if (!opponentId) {
    return NextResponse.json(
      {
        error: "Invalid request parameteres",
      },
      {
        status: 400,
      }
    );
  }
  if (!sessionData) {
    return NextResponse.json(
      {
        error: "You are not authorized for this request please login first.",
      },
      {
        status: 401,
      }
    );
  }
  if (opponentId == sessionData?.id) {
    return NextResponse.json(
      {
        error: "You cannot folllow yourself",
      },
      {
        status: 400,
      }
    );
  }
  try {
    await connectDatabase();
    const opponent = await prisma.user.findUnique({
      where: {
        id: opponentId,
      },
      include: {
        followers: true,
        following: true,
      },
    });
    const user = await prisma.user.findUnique({
      where: {
        id: sessionData.id as string,
      },
      include: {
        followers: true,
        following: true,
      },
    });
    if (!user || !opponent) {
      return NextResponse.json(
        {
          error: "User or opponent user not found",
        },
        {
          status: 404,
        }
      );
    }
    const existingFollower = await user.following.find(
      (following) => following.followingId.toString() == opponent.id.toString()
    );
    if (!existingFollower) {
      await prisma.follows.create({
        data: {
          followedById: user.id,
          followingId: opponent.id,
        },
      });
      const updatedOpponent = await prisma.user.findUnique({
        where: {
          id: opponent.id,
        },
        select: {
          id: true,
          userName: true,
          profileImage: true,
          bio: true,
          _count: {
            select: {
              followers: true,
              following: true,
            },
          },
        },
      });
      return NextResponse.json({
        message: "Followed successfully",
        opponentUser: updatedOpponent,
      });
    } else {
      await prisma.follows.delete({
        where: {
          followingId_followedById: {
            followedById: existingFollower.followedById,
            followingId: existingFollower.followingId,
          },
        },
      });
      const updatedOpponent = await prisma.user.findUnique({
        where: {
          id: opponent.id,
        },
        select: {
          id: true,
          userName: true,
          profileImage: true,
          bio: true,
          _count: {
            select: {
              followers: true,
              following: true,
            },
          },
        },
      });
      return NextResponse.json(
        {
          message: "Unfollowed successfuly",
          opponentUser: updatedOpponent,
        },
        {
          status: 200,
        }
      );
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

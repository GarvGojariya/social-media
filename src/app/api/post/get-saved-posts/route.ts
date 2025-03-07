import { NextRequest, NextResponse } from "next/server";
import connectDatabase, { prisma } from "../../../../../utils/db";
import { verifySession } from "../../../../../utils/verifySession";

export async function GET(req: NextRequest) {
  const params = await req.nextUrl.searchParams;
  const pageNo = params.get("pageNo");
  const limit = 10;
  const sessionCheck = await verifySession(req);
  if (!sessionCheck.authorized) return sessionCheck.response;

  const { user: sessionData } = sessionCheck;

  try {
    await connectDatabase();

    const user = await prisma.user.findUnique({
      where: {
        id: sessionData.id as string,
      },
      include: {
        savedPosts: {
          include: {
            post: {
              include: {
                _count: {
                  select: {
                    comments: true,
                    likes: true,
                  },
                },
                user: {
                  select: {
                    id: true,
                    name: true,
                    userName: true,
                    profileImage: true,
                  },
                },
                likes: {
                  where: {
                    ownerId: sessionData.id,
                  },
                },
              },
            },
          },
          ...(pageNo
            ? { take: limit, skip: (parseInt(pageNo) - 1) * limit }
            : {}),
        },
      },
    });
    const totalSavedPosts = await prisma.savedPost.count({
      where: {
        ownerId: sessionData.id as string,
      },
    });

    if (!user || !user.savedPosts) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // Modify savedPosts to include the post and rename user to owner
    const savedPostsWithOwner: any = user.savedPosts.map((savedPost) => {
      const { user: owner, ...postRest } = savedPost.post;
      return {
        ...postRest,
        owner,
      };
    });

    await savedPostsWithOwner.map((savedPost: any) => {
      if (savedPost.likes[0]?.ownerId === sessionData.id) {
        savedPost.isLiked = true;
        delete savedPost.likes;
      } else {
        savedPost.isLiked = false;
        delete savedPost.likes;
      }
    });

    return NextResponse.json({
      savedPosts: savedPostsWithOwner,
      totalPosts: totalSavedPosts,
    });
  } catch (error) {
    console.error(error);
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

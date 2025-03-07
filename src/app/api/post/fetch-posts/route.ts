import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";
import { verifySession } from "../../../../../utils/verifySession";

export async function GET(req: NextRequest) {
  const sessionCheck = await verifySession(req);
  if (!sessionCheck.authorized) return sessionCheck.response;

  const { user: sessionData } = sessionCheck;
  const params = await req.nextUrl.searchParams;
  const pageNo = await params.get("pageNo");
  const limit = 10;
  if (!sessionData || !sessionData.id) {
    return NextResponse.json(
      {
        message: "You are not loggedin yet please login first,",
      },
      {
        status: 401,
      }
    );
  } else {
      try {
        await connectDatabase()
      const [postsData, totalPosts] = await Promise.all([
        prisma.post.findMany({
          where: {
            ownerId: {
              not: sessionData.id,
            },
            likes: {
              none: {
                ownerId: sessionData.id,
              },
            },
          },
          include: {
            user: {
              select: {
                id: true,
                userName: true,
                profileImage: true,
                name: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
            savedPosts: {
              where: {
                ownerId: sessionData.id,
              },
            },
            likes: {
              where: {
                ownerId: sessionData.id,
              },
            },
          },
          take: limit,
          skip: pageNo ? (parseInt(pageNo) - 1) * limit : 0,
        }),
        prisma.post.count(),
      ]);

      const posts = postsData.map((post) => {
        const isSaved = post.savedPosts.some(
          (savedPost) => savedPost.ownerId === sessionData.id
        );
        const isLiked = post.likes.some(
          (like) => like.ownerId === sessionData.id
        );

        const { user, ...rest } = post;

        return {
          ...rest,
          owner: user,
          isSaved,
          isLiked,
          savedPosts: undefined,
          likes: undefined,
        };
      });
      return NextResponse.json({
        message: "Posts fetched successfully.",
        posts,
        totalPosts,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}

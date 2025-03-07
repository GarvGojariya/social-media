import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";
import { getPostDetails } from "../../../../../utils/dbHelpers/dbHelpers";
import { verifySession } from "../../../../../utils/verifySession";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const postId = await params.get("id");
  const sessionCheck = await verifySession(req);
  if (!sessionCheck.authorized) return sessionCheck.response;
  const { user: sessionData } = sessionCheck;
  await connectDatabase();
  if (postId) {
    if (sessionData) {
      try {
        let isLiked;
        let isSaved;
        const post = await getPostDetails(postId);
        if (post) {
          const liked = await prisma.like.findFirst({
            where: {
              ownerId: sessionData.id as string,
              postId: post.id,
            },
          });
          const saved = await prisma.savedPost.findFirst({
            where: {
              ownerId: sessionData.id as string,
              postId: post.id,
            },
          });
          if (liked) {
            isLiked = true;
          } else {
            isLiked = false;
          }
          if (saved) {
            isSaved = true;
          } else {
            isSaved = false;
          }
          const { user, ...postWithoutUser } = post;
          const postDetail = {
            ...postWithoutUser,
            owner: user,
            isLiked,
            isSaved,
          };
          return NextResponse.json({
            message: "Post detail fetched successfully",
            data: postDetail,
          });
        } else {
          return NextResponse.json(
            {
              message: "Post not found",
              data: null,
            },
            { status: 404 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          {
            message: "Internal Server Error",
          },
          {
            status: 500,
          }
        );
      }
    } else {
      return NextResponse.json(
        {
          message: "You are not authorized for this action please login first.",
          data: null,
        },
        { status: 401 }
      );
    }
  } else {
    return NextResponse.json(
      {
        message: "something went wrong while getting post detail",
      },
      {
        status: 500,
      }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";
import { verifySession } from "../../../../../utils/verifySession";

export async function DELETE(req: NextRequest) {
  const params = await req.nextUrl.searchParams;
  const postId = params.get("postId");

  const sessionCheck = await verifySession(req);
  if (!sessionCheck.authorized) return sessionCheck.response;

  if (!postId || postId === "") {
    return NextResponse.json(
      {
        message: "Invalid request parameters.",
      },
      {
        status: 400,
      }
    );
  }
  await connectDatabase();
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return NextResponse.json(
        {
          message: "post with this postId is not found.",
        },
        {
          status: 404,
        }
      );
    } else if (post.ownerId !== sessionCheck.user.id) {
      return NextResponse.json(
        {
          message: "You are not authorized to delete this post.",
        },
        {
          status: 403,
        }
      );
    } else {
      await prisma.post.delete({
        where: {
          id: postId,
        },
      });
      return NextResponse.json(
        {
          message: "Post deleted successfully.",
        },
        {
          status: 200,
        }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Something went wrong while delete post.",
      },
      {
        status: 500,
      }
    );
  }
}

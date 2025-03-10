import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "../../../../../utils/db";
import { prisma } from "../../../../../utils/db";
import { verifyToken } from "../../../../../utils/verifyToken";
import { verifySession } from "../../../../../utils/verifySession";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const name = params.get("name");
  const sessionCheck = await verifySession(req);
  if (!sessionCheck.authorized) return sessionCheck.response;

  const { user: sessionData } = sessionCheck;
  if (!sessionData || !sessionData.id) {
    return NextResponse.json(
      {
        message: "You are not authorized for this action please login first.",
      },
      {
        status: 401,
      }
    );
  }
  if (name) {
    try {
      await connectDatabase();
      const searchResults = await prisma.user.findMany({
        where: {
          AND: [
            {
              id: {
                not: sessionData.id,
              },
              isVerified: {
                equals: true,
              },
            },
            {
              OR: [
                {
                  name: {
                    contains: name,
                    mode: "insensitive",
                  },
                },
                {
                  userName: {
                    startsWith: name,
                    mode: "insensitive",
                  },
                },
              ],
            },
          ],
        },
        select: {
          id: true,
          name: true,
          userName: true,
          profileImage: true,
        },
      });
      return NextResponse.json(
        {
          message: searchResults.length > 0 ? "User found" : "No user found",
          data: searchResults,
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        {
          error: "Internam server error",
        },
        {
          status: 500,
        }
      );
    }
  } else {
    return NextResponse.json(
      {
        message: "Enter name of user to search for",
      },
      {
        status: 400,
      }
    );
  }
}

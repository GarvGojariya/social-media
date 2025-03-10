import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { prisma } from "../../../../../utils/db";
import { verifyToken } from "../../../../../utils/verifyToken";
import { verifySession } from "../../../../../utils/verifySession";

export async function POST(req: NextRequest) {
  const { userName, name, profileImage, birthDate, bio } = await req.json();
  const sessionCheck = await verifySession(req);
  if (!sessionCheck.authorized) return sessionCheck.response;

  const { user: sessionData } = sessionCheck;
  try {
    if (sessionData && sessionData.id) {
      const user = await prisma.user.findFirst({
        where: {
          id: sessionData.id,
        },
      });
      if (userName) {
        const existingUserName = await prisma.user.findFirst({
          where: {
            userName: userName,
          },
        });
        if (existingUserName) {
          return NextResponse.json(
            {
              error: "This username is already exists please try diffrent one",
            },
            {
              status: 400,
            }
          );
        }
      }
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      } else {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            userName: userName ?? user.userName,
            name: name ?? user.name,
            profileImage: profileImage ?? user.profileImage,
            birthDate: birthDate ?? user.birthDate,
            bio: bio ?? user.bio,
          },
        });
        return NextResponse.json(
          { message: "User updated successfully" },
          { status: 200 }
        );
      }
    } else {
      return NextResponse.json(
        {
          error: "You are not authorized for this action",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

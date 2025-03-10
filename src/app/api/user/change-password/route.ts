import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../utils/db";
import { isPasswordCorrect } from "../../../../../utils/auth";
import { verifySession } from "../../../../../utils/verifySession";

export async function POST(req: NextRequest) {
  const { currentPassword, newPassword } = await req.json();
  if (currentPassword == newPassword) {
    return NextResponse.json(
      {
        error: "New password cannot be the same as the current password",
      },
      {
        status: 400,
      }
    );
  }
  const sessionCheck = await verifySession(req);
  if (!sessionCheck.authorized) return sessionCheck.response;

  const { user: sessionData } = sessionCheck;
  if (sessionData && sessionData.id) {
    try {
      if (sessionData.id) {
        const user = await prisma.user.findFirst({
          where: {
            id: sessionData.id,
          },
        });
        if (!user) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }
        if (user) {
          const matchPassword = await isPasswordCorrect({
            password: currentPassword,
            dbPassword: user.password,
          });
          if (!matchPassword) {
            return NextResponse.json(
              { error: "Current password is incorrect" },
              { status: 401 }
            );
          } else {
            await prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                password: newPassword,
              },
            });
            return NextResponse.json(
              {
                message: "Password updated successfully",
              },
              { status: 200 }
            );
          }
        }
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

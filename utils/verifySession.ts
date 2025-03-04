import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

type UserSession = {
  id: string;
  name: string;
  email: string;
  userName?: string;
  profileImage?: string;
};

type SessionResponse =
  | { authorized: true; user: UserSession }
  | { authorized: false; response: NextResponse };

export async function verifySession(req:NextRequest): Promise<SessionResponse> {
  const session = await getServerSession(authOptions);
  const token = await getToken({req})
  // console.log("🚀 ~ verifySession ~ session:", session,token)
  // console.log("Session details:", {
  //   exists: !!session,
  //   hasUser: !!session?.user,
  //   hasId: !!session?.user?.id,
  //   timestamp: new Date().toISOString()
  // });
  

  // Ensure the session and user ID exist
  if (!session?.user?.id) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          message:
            "You are not authorized for this action. Please log in first.",
        },
        { status: 401 }
      ),
    };
  }

  return {
    authorized: true,
    user: {
      id: session.user.id, // ✅ TypeScript is now sure 'id' is a string
      name: session.user.name || "Unknown",
      email: session.user.email || "No email provided",
      userName: session.user.userName || undefined,
      profileImage: session.user.profileImage || undefined,
    },
  };
}

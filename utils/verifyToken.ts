// utils/jwt.ts
import * as jose from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export interface DecodedToken {
    id: string;
    iat: number;
    exp: number;
    [key: string]: any;
}

export async function verifyToken() {
    const token = await cookies().get("accessToken")
    if (!token) {
        // throw new Error(
        //     "No token provided"
        // )
        return
    }
    try {
        const { payload:decodedToken} = await jose.jwtVerify(token.value, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET))
        return decodedToken as DecodedToken

    } catch (error) {
        throw new Error(
            "Invalid token"
        )
    }
}

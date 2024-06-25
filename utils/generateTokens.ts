import * as jose from "jose";
interface User {
    id: string;
    email: string;
    name: string;
}

const generateAccessToken = async function (user: User): Promise<string> {
    return new jose.SignJWT({
        id: user.id,
        email: user.email,
        name: user.name,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRY!)
        .sign(new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!));
};

const generateRefreshToken = async function (user: User): Promise<string> {
    return new jose.SignJWT({
        id: user.id,
        email: user.email,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRY!)
        .sign(new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET));
}

export {
    generateAccessToken,
    generateRefreshToken
};

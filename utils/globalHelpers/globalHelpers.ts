import { formatDistanceToNow } from 'date-fns';
import { DecodedToken } from "../verifyToken";
import * as jose from "jose"

const formatDate = async (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function getCookie(cname: string): string {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

async function decodeToken(token: any) {
    if (!token) {
        // throw new Error(
        //     "No token provided"
        // )
        return
    }
    try {
        const { payload: decodedToken } = await jose.jwtVerify(token.value, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET))
        return decodedToken as DecodedToken

    } catch (error) {
        throw new Error(
            "Invalid token"
        )
    }
}

const getCurrentUserData = async () => {
    const d = await sessionStorage.getItem("userData")
    if (!d) return
    const userData: {
        id: string,
        name: string,
        userName: string,
        profileImage: string
    } = await JSON.parse(d)
    return userData
}


const getDateTimeFromNow =  (dateString: string) => {
    const createdAt = new Date(dateString);
    const timeAgo =  formatDistanceToNow(createdAt, { addSuffix: true });
    return timeAgo
}

export {
    formatDate,
    getCookie,
    decodeToken,
    getCurrentUserData,
    getDateTimeFromNow
}
export interface User {
    id: string;
    userName: string;
    email: string;
    name: string;
    password: string;
    bio: string;
    profileImage?: string;
    isVerified: boolean;
    birthDate: string;
}


export interface ProfileData {
    id: string;
    name: string;
    email: string;
    profileImage: string;
    bio: string;
    userName: string;
    posts: {
        id: string;
        url: string;
        caption: string;
        ownerId: string;
        createdAt: string;
        updatedAt: string;
    }[],
    _count: {
        followers: number,
        following: number,
        posts: number
    }
}
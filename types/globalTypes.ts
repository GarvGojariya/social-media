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


export interface Follower {
    followedById: string;
    followingId: string;
    followedBy: {
        id: string;
        name: string;
        profileImage: string;
        userName: string;
        isFollowed: boolean
    }
}

export interface Following {
    followedById: string;
    followingId: string;
    following: {
        id: string;
        name: string;
        profileImage: string;
        userName: string;
    }
}

export interface savedPost {
    id: string;
    url: string;
    caption: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    _count: {
        comments: number;
        likes: number;
    }
}

export interface Comment {
    id: string;
    text: string;
    postId: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    owner: {
        id: string;
        name: string;
        userName: string;
        profileImage: string;
    };
    isLiked:boolean;
}
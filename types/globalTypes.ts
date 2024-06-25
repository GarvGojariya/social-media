export default interface User {
    id: string;
    userName: string;
    email: string;
    name: string;
    password: string;
    bio: string;
    profileImage?: string;
    isVerified: boolean;
    birthDate:string;
}

import connectDatabase from "../db"
import { prisma } from "../db"

const getPostDetails = async (postId: string) => {
    await connectDatabase()
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: postId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        userName: true,
                        profileImage: true,
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                }
            }
        })
        return post
    } catch (error) {
        console.log(error)
        throw new Error(
            "Failed to fetch post details. Please try again later."
        )
    }
}

export {
    getPostDetails
}
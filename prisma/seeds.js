import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// async function main() {
//     const posts = [
//         { url: 'https://res.cloudinary.com/dpd3gmgdk/image/upload/fl_preserve_transparency/v1721274293/samples/smile.jpg?_s=public-apps', caption: 'Smiling Face' },
//         { url: 'https://res.cloudinary.com/dpd3gmgdk/image/upload/fl_preserve_transparency/v1721274293/samples/balloons.jpg?_s=public-apps', caption: 'Colorful Balloons' },
//         { url: 'https://res.cloudinary.com/dpd3gmgdk/image/upload/fl_preserve_transparency/v1721274294/samples/man-on-a-street.jpg?_s=public-apps', caption: 'Man Walking on Street' },
//         { url: 'https://res.cloudinary.com/dpd3gmgdk/image/upload/fl_preserve_transparency/v1721274295/cld-sample.jpg?_s=public-apps', caption: 'Artistic Portrait' },
//         { url: 'https://res.cloudinary.com/dpd3gmgdk/image/upload/fl_preserve_transparency/v1721274293/samples/breakfast.jpg?_s=public-apps', caption: 'Delicious Breakfast' },
//         { url: 'https://res.cloudinary.com/dpd3gmgdk/image/upload/fl_preserve_transparency/v1721274293/samples/outdoor-woman.jpg?_s=public-apps', caption: 'Woman Enjoying Outdoors' },
//         { url: 'https://res.cloudinary.com/dpd3gmgdk/image/upload/fl_preserve_transparency/v1721274294/samples/coffee.jpg?_s=public-apps', caption: 'Morning Coffee' },
//     ];

//     for (const post of posts) {
//         await prisma.post.create({
//             data: {
//                 ...post,
//                 ownerId: "0c9af423-28db-4889-b8c9-9fa6f4e97909"
//             },
//         });
//     }
// }

// main()
//     .catch(e => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });

// async function main() {
//     // Fetch a subset of users (e.g., 20 random users)
//     const users = await prisma.user.findMany({
//         take: 50,
//         orderBy: {
//             id: 'asc'
//         }
//     });

//     if (users.length < 2) {
//         console.error("Not enough users to create follow relationships");
//         return;
//     }

//     // Create follow relationships
//     const follows = [];
//     const followPairs = new Set(); // To ensure no duplicate follow relationships

//     users.forEach((followedBy) => {
//         const followCount = Math.floor(Math.random() * (users.length - 1)) + 1; // Random number of follows for each user
//         const shuffledUsers = users.sort(() => 0.5 - Math.random()); // Shuffle users

//         for (let i = 0; i < followCount; i++) {
//             const following = shuffledUsers[i];
//             if (followedBy.id !== following.id && !followPairs.has(`${followedBy.id}-${following.id}`)) {
//                 follows.push({
//                     followedById: followedBy.id,
//                     followingId: following.id
//                 });
//                 followPairs.add(`${followedBy.id}-${following.id}`);
//             }
//         }
//     });

//     // Insert follow relationships into the database
//     for (const follow of follows) {
//         await prisma.follows.create({
//             data: follow
//         });
//     }

//     console.log(`Created ${follows.length} follow relationships`);
// }

// main()
//     .catch(e => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });

import { faker } from "@faker-js/faker"

// async function main() {
//     // Fetch all users
//     const users = await prisma.user.findMany();

//     const posts = [];

//     // Generate posts for each user
//     users.forEach(user => {
//         const postCount = Math.floor(Math.random() * 10) + 1; // Random number of posts between 1 and 10 for each user

//         for (let i = 0; i < postCount; i++) {
//             posts.push({
//                 url: faker.image.url(),
//                 caption: faker.lorem.sentence(),
//                 ownerId: user.id,
//                 createdAt: faker.date.recent(30), // Posts from the last 30 days
//                 updatedAt: new Date()
//             });
//         }
//     });

//     // Insert posts into the database
//     for (const post of posts) {
//         await prisma.post.create({
//             data: post
//         });
//     }

//     console.log(`Created ${posts.length} posts for ${users.length} users`);
// }

// main()
//     .catch(e => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });


async function main() {
    const posts = await prisma.post.findMany();
    const users = await prisma.user.findMany({
        where: {
            isVerified: {
                equals: true,
            },
        },
    });

    const selectedPosts = posts.filter(() => Math.random() < 0.5); // 50% chance to select a post
    const selectedUsers = users.filter(() => Math.random() < 0.5); // 50% chance to select a user

    for (const post of selectedPosts) {
        const commentsCount = await prisma.comment.count({
            where: { postId: post.id },
        });

        const commentsToAdd = Math.max(6 - commentsCount, 0);

        if (commentsToAdd > 0) {
            const comments = Array.from({ length: commentsToAdd }).map(() => ({
                text: faker.lorem.sentence(),
                postId: post.id,
                ownerId: selectedUsers[Math.floor(Math.random() * selectedUsers.length)].id, // Select a random user from the filtered list
            }));

            await prisma.comment.createMany({
                data: comments,
            });
        }
    }

    console.log('Comments added successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { faker } from "@faker-js/faker"

//create users
// async function seedUsers() {
//     const users = [];

//     for (let i = 0; i < 20; i++) {
//         users.push({
//             id: faker.datatype.uuid(),
//             userName: faker.internet.userName(),
//             name: faker.name.fullName(),
//             email: `${faker.internet.userName().toLowerCase()}@yopmail.com`,
//             password: "$2a$10$DmjGRMW6Uakr1ympqcaij.RfMWFQ3YlbRzpRNR8sUorOO6ddsTcx.",
//             birthDate: faker.date.birthdate({ min: 18, max: 60, mode: "age" }).toISOString().split("T")[0],
//             profileImage: faker.image.avatar(),
//             bio: faker.lorem.sentence(),
//             isVerified: faker.datatype.boolean(),
//         });
//     }

//     await prisma.user.createMany({
//         data: users,
//     });

//     console.log("20 users created!");
// }

// seedUsers()
//     .catch((e) => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });


//create posts

const userIds = [
    "d54850d8-328d-4064-b3e5-366cc9a9b04e",
    "764e3f90-6b21-46ef-b565-f514a00fb01b",
    "7b69c25e-f1d7-4a59-8b4d-208f59eb0c12",
    "e392a850-21c0-44a4-8a3e-01f71ef0f684",
    "9d316893-397e-431e-bac7-28dfffb6df2f",
    "8462caaa-7bc8-449e-93fb-f58dd8922a6a",
    "5325c177-e98c-4df7-88cb-aebd073482f1",
    "67dfde78-b57f-4269-a065-75bb63a6f9e2",
    "16a0f836-e071-4289-b27c-e2230f61c8fb",
];

// const createPosts = async () => {
//   for (const userId of userIds) {
//     for (let i = 0; i < 8; i++) {
//       await prisma.post.create({
//         data: {
//           url: faker.image.imageUrl(800, 600, "nature", true), // Generates a unique image URL
//           caption: faker.lorem.sentence(), // Generates a random caption
//           ownerId: userId,
//         },
//       });
//     }
//   }
// };

// const main = async () => {
//   try {
//     console.log("Seeding posts with unique images...");
//     await createPosts();
//     console.log("Seeding completed!");
//   } catch (error) {
//     console.error("Error seeding data:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// };

// main();



///create followers and followings

const createFollowersAndFollowings = async () => {
    for (const userId of userIds) {
        // Randomly select users to follow
        const followingIds = faker.helpers.arrayElements(
            userIds.filter((id) => id !== userId), // Exclude the current user
            faker.datatype.number({ min: 2, max: 5 }) // Random number of followings
        );

        for (const followingId of followingIds) {
            // Create a follow relationship
            await prisma.follows.create({
                data: {
                    followedById: userId, // Current user is the follower
                    followingId, // The user being followed
                },
            });
        }

        // Randomly select users to be followed by
        const followerIds = faker.helpers.arrayElements(
            userIds.filter((id) => id !== userId), // Exclude the current user
            faker.datatype.number({ min: 2, max: 5 }) // Random number of followers
        );

        for (const followerId of followerIds) {
            // Create a follow relationship
            await prisma.follows.create({
                data: {
                    followedById: followerId, // The user who follows
                    followingId: userId, // Current user is being followed
                },
            });
        }
    }
};

const main = async () => {
    try {
        console.log("Seeding followers and followings...");
        await createFollowersAndFollowings();
        console.log("Seeding completed!");
    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        await prisma.$disconnect();
    }
};

main();
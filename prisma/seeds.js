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
  "0273f306-33ec-4aff-a877-9dd499f898f1",
  "2a19560e-e651-464d-8846-48200013e595",
  "2dadfd07-7efa-4b3a-a554-3a50b17d9b5c",
  "5fe7f998-4d2d-4f5b-8804-5e8da2c55254",
  "635b3c16-0721-4762-8319-1fc31e968d40",
  "7c841666-9cb4-445a-8811-28135cabe01b",
  "845b9d8a-5060-45ab-9458-a35c33582d6a",
  "8a6f4c32-b37a-4886-9c98-073137583ea1",
  "aed486b2-186b-475b-9008-d1fff717b61c",
  "c44c85f5-f0b0-4218-99ef-3e6a98bd1914",
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
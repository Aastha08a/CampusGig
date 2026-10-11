const prisma = require("../src/lib/prisma");

const skills = [
  "Web Development",
  "UI/UX Design",
  "Graphic Design",
  "Programming",
  "Data Analysis",
  "Content Writing",
  "Video Editing",
  "Photography",
  "Social Media",
  "Marketing",
  "Tutoring",
  "Event Management",
];

async function main() {
  for (const skill of skills) {
    await prisma.skill.upsert({
      where: {
        name: skill,
      },
      update: {},
      create: {
        name: skill,
      },
    });
  }

  console.log("Skills seeded successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
const prisma = require("../lib/prisma");

async function getAllSkills() {
  return prisma.skill.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

module.exports = {
  getAllSkills,
};
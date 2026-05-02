import prisma from "../../../services/db/prismaClient.js";
import crypto from "crypto";

async function createProject({ projectName, creatorSlackId }) {
  const project = await prisma.project.create({
    data: {
      id: crypto.randomUUID(),
      name: projectName,
      created_by: creatorSlackId,
    },
  });

  return project;
}

export default createProject;
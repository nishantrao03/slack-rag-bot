import prisma from "../../../services/db/prisma-client.js";
import crypto from "crypto";

async function createProject({ projectName, creatorSlackId }) {
  try {
    const project = await prisma.project.create({
      data: {
        id: crypto.randomUUID(),
        name: projectName,
        created_by: creatorSlackId,
      },
    });

    return project;
  } catch (error) {
    const err = new Error(
      `createProject failed: ${error && error.message ? error.message : String(error)}`
    );
    err.originalError = error;
    throw err;
  }
}

export default createProject;
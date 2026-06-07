import prisma from "../services/db/prisma-client.js";

import {
  get,
  set,
  deleteKey
} from "./cache-service.js";

const PROJECT_MEMBER_TTL = 3600;

function getProjectMemberCacheKey(
  projectId,
  userId
) {
  return `project-member:${projectId}:${userId}`;
}

export async function getProjectMember(
  projectId,
  userId
) {
  const cacheKey =
    getProjectMemberCacheKey(
      projectId,
      userId
    );

  try {
    const cachedMember =
      await get(cacheKey);

    if (cachedMember) {
      return cachedMember;
    }
  } catch (error) {
    console.error(
      `[CACHE READ FAILED] ${cacheKey}`,
      error
    );
  }

  const projectMember =
    await prisma.projectMember.findUnique({
      where: {
        project_id_user_id: {
          project_id: projectId,
          user_id: userId
        }
      }
    });

  const result = projectMember
    ? {
        exists: true,
        role: projectMember.role
      }
    : {
        exists: false,
        role: null
      };

  try {
    await set(
      cacheKey,
      result,
      PROJECT_MEMBER_TTL
    );
  } catch (error) {
    console.error(
      `[CACHE WRITE FAILED] ${cacheKey}`,
      error
    );
  }

  return result;
}

export async function isProjectMember(
  projectId,
  userId
) {
  const member =
    await getProjectMember(
      projectId,
      userId
    );

  return member.exists;
}

export async function isProjectManager(
  projectId,
  userId
) {
  const member =
    await getProjectMember(
      projectId,
      userId
    );

  return (
    member.exists &&
    member.role === "manager"
  );
}

export async function invalidateProjectMember(
  projectId,
  userId
) {
  const cacheKey =
    getProjectMemberCacheKey(
      projectId,
      userId
    );

  try {
    await deleteKey(
      cacheKey
    );
  } catch (error) {
    console.error(
      `[CACHE INVALIDATION FAILED] ${cacheKey}`,
      error
    );
  }
}
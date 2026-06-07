import prisma from "../services/db/prisma-client.js";

import {
    get,
    set,
    deleteKey
} from "./cache-service.js";

const PROJECT_USERS_TTL = 3600;

function getProjectUsersCacheKey(
    projectId
) {
    return `project-users:${projectId}`;
}

export async function getProjectUsers(
    projectId
) {
    const cacheKey =
        getProjectUsersCacheKey(
            projectId
        );

    const cachedUsers =
        await get(cacheKey);

    if (cachedUsers) {
        return cachedUsers;
    }

    const projectUsers =
        await prisma.projectMember.findMany({
            where: {
                project_id: projectId
            },
            select: {
                user_id: true,
                role: true
            }
        });

    const users =
        projectUsers.map(
            ({
                user_id,
                role
            }) => ({
                userId: user_id,
                role
            })
        );

    await set(
        cacheKey,
        users,
        PROJECT_USERS_TTL
    );

    return users;
}

export async function invalidateProjectUsers(
    projectId
) {
    const cacheKey =
        getProjectUsersCacheKey(
            projectId
        );

    await deleteKey(cacheKey);
}
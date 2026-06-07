import prisma from "../services/db/prisma-client.js";

import {
    get,
    set,
    deleteKey
} from "./cache-service.js";

const USER_PROJECTS_TTL = 3600;

function getUserProjectsCacheKey(
    userId
) {
    return `user-projects:${userId}`;
}

export async function getUserProjects(
    userId
) {
    const cacheKey =
        getUserProjectsCacheKey(
            userId
        );

    try {
        const cachedProjects =
            await get(cacheKey);

        if (cachedProjects) {
            return cachedProjects;
        }
    } catch (error) {
        console.error(
            `[CACHE READ FAILED] ${cacheKey}`,
            error
        );
    }

    const projectMemberships =
        await prisma.projectMember.findMany({
            where: {
                user_id: userId
            },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

    const projects =
        projectMemberships.map(
            (membership) => ({
                id: membership.project.id,
                name: membership.project.name
            })
        );

    try {
        await set(
            cacheKey,
            projects,
            USER_PROJECTS_TTL
        );
    } catch (error) {
        console.error(
            `[CACHE WRITE FAILED] ${cacheKey}`,
            error
        );
    }

    return projects;
}

export async function invalidateUserProjects(
    userId
) {
    const cacheKey =
        getUserProjectsCacheKey(
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
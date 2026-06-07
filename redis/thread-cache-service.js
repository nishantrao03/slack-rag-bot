import prisma from "../services/db/prisma-client.js";

import {
    get,
    set,
    deleteKey
} from "./cache-service.js";

const THREAD_PROJECT_TTL = 3600;

function getThreadProjectCacheKey(
    threadId
) {
    return `thread-project:${threadId}`;
}

export async function getThreadProject(
    threadId
) {
    const cacheKey =
        getThreadProjectCacheKey(
            threadId
        );

    try {
        const cachedProjectId =
            await get(cacheKey);

        if (cachedProjectId) {
            return cachedProjectId;
        }
    } catch (error) {
        console.error(
            `[CACHE READ FAILED] ${cacheKey}`,
            error
        );
    }

    const thread =
        await prisma.thread.findUnique({
            where: {
                thread_id: threadId
            },
            select: {
                project_id: true
            }
        });

    const projectId =
        thread?.project_id ?? null;

    try {
        await set(
            cacheKey,
            projectId,
            THREAD_PROJECT_TTL
        );
    } catch (error) {
        console.error(
            `[CACHE WRITE FAILED] ${cacheKey}`,
            error
        );
    }

    return projectId;
}

export async function invalidateThreadProject(
    threadId
) {
    const cacheKey =
        getThreadProjectCacheKey(
            threadId
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
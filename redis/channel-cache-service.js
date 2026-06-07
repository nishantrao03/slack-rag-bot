import prisma from "../services/db/prisma-client.js";

import {
    get,
    set,
    deleteKey
} from "./cache-service.js";

const CHANNEL_PROJECT_TTL = 3600;

function getChannelProjectCacheKey(
    channelId
) {
    return `channel-project:${channelId}`;
}

export async function getChannelProject(
    channelId
) {
    const cacheKey =
        getChannelProjectCacheKey(
            channelId
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

    const channel =
        await prisma.channel.findUnique({
            where: {
                channel_id: channelId
            },
            select: {
                project_id: true
            }
        });

    const projectId =
        channel?.project_id ?? null;

    try {
        await set(
            cacheKey,
            projectId,
            CHANNEL_PROJECT_TTL
        );
    } catch (error) {
        console.error(
            `[CACHE WRITE FAILED] ${cacheKey}`,
            error
        );
    }

    return projectId;
}

export async function invalidateChannelProject(
    channelId
) {
    const cacheKey =
        getChannelProjectCacheKey(
            channelId
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
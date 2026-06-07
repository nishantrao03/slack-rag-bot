import redisClient from "./redis-client.js";
import {
    connectRedis
} from "./redis-client.js";

// console.log(
//     "[CACHE SERVICE CLIENT]",
//     redisClient._debugId
// );

export async function get(key) {
  const value = await redisClient.get(key);

  if (!value) {
    return null;
  }

  return JSON.parse(value);
}

export async function set(key, value, ttlSeconds = 3600) {
  await redisClient.set(
    key,
    JSON.stringify(value),
    {
      EX: ttlSeconds
    }
  );
}

export async function deleteKey(key) {
//   console.log(
//     "[REDIS] isOpen:",
//     redisClient.isOpen
//   );
  
//   await connectRedis();

//   console.log(
//     "[REDIS] isOpen:",
//     redisClient.isOpen
//   );

  await redisClient.del(key);
}
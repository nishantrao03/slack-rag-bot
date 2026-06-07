// import { createClient } from "redis";

// const redisClient = createClient({
//     username: process.env.REDIS_USERNAME,
//     password: process.env.REDIS_PASSWORD,
//     socket: {
//         host: process.env.REDIS_HOST,
//         port: Number(process.env.REDIS_PORT)
//     }
// });

// redisClient.on("error", (error) => {
//     console.error("Redis Client Error:", error);
// });

// // export async function connectRedis() {
// //     if (!redisClient.isOpen) {
// //         await redisClient.connect();
// //         console.log("Redis connected successfully.");
// //     }
// // }

// redisClient.on(
//     "end",
//     () => {
//         console.log(
//             "[REDIS] Connection ended"
//         );
//     }
// );

// redisClient.on(
//     "reconnecting",
//     () => {
//         console.log(
//             "[REDIS] Reconnecting"
//         );
//     }
// );

// export async function connectRedis() {
//     console.log(
//         "[REDIS] connectRedis called"
//     );

//     console.log(
//         "[REDIS] Before connect:",
//         redisClient.isOpen
//     );

//     if (!redisClient.isOpen) {
//         await redisClient.connect();

//         console.log(
//             "[REDIS] Connected successfully."
//         );
//     }

//     console.log(
//         "[REDIS] After connect:",
//         redisClient.isOpen
//     );
// }

// export default redisClient;

// import { createClient } from "redis";

// const redisClient = createClient({
//     username: process.env.REDIS_USERNAME,
//     password: process.env.REDIS_PASSWORD,
//     socket: {
//         host: process.env.REDIS_HOST,
//         port: Number(process.env.REDIS_PORT),
//         // Enforce TLS for cloud provider compatibility
//         // tls: true,
//         // Prevent idle connection drops
//         keepAlive: 5000 
//     }
// });

// redisClient.on("error", (error) => {
//     console.error("Redis Client Error:", error);
// });

// redisClient.on(
//     "end",
//     () => {
//         console.log(
//             "[REDIS] Connection ended"
//         );
//     }
// );

// redisClient.on(
//     "reconnecting",
//     () => {
//         console.log(
//             "[REDIS] Reconnecting"
//         );
//     }
// );

// // Gracefully handle Nodemon restarts to prevent connection limit exhaustion
// process.once("SIGUSR2", async () => {
//     if (redisClient.isOpen) {
//         console.log("[REDIS] Gracefully closing connection for Nodemon restart...");
//         await redisClient.quit();
//     }
//     process.kill(process.pid, "SIGUSR2");
// });

// export async function connectRedis() {
//     console.log(
//         "[REDIS] connectRedis called"
//     );

//     console.log(
//         "[REDIS] Before connect:",
//         redisClient.isOpen
//     );

//     if (!redisClient.isOpen) {
//         await redisClient.connect();

//         console.log(
//             "[REDIS] Connected successfully."
//         );
//     }

//     console.log(
//         "[REDIS] After connect:",
//         redisClient.isOpen
//     );
// }

// export default redisClient;

import { createClient } from "redis";

// Initialize the v6 client using your environment variables
const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }
});

// It is highly recommended to listen for errors in v6.
// Without this, connection errors will crash the Node.js process.
redisClient.on("error", (error) => {
    console.error("Redis Client Error:", error);
});

export async function connectRedis() {
    // Check if the connection is already established before connecting
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log("Connected to Redis successfully!");
    }
}

export default redisClient;
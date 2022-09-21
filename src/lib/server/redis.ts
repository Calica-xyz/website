import { createClient } from "redis";

var redisClient: any = null;

export async function initializeRedisClient() {
  // TODO: Move these to env variables
  redisClient = createClient({
    socket: {
      host: "redis-18965.c1.us-west-2-2.ec2.cloud.redislabs.com",
      port: 18965,
    },
    username: "default",
    password: "RSUBXZ6Ea0J1uGziYvZeRyrQcz1bCdKV",
  });

  redisClient.on("error", (err: any) => console.log("Redis Client Error", err));

  await redisClient.connect();

  console.log("Redis client connected");
}

export function isRedisClientInitialized() {
  return redisClient != null;
}

export function getRedisClient() {
  return redisClient;
}

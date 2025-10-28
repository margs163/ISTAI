import { createClient, RedisClientType } from "redis";

export const client = createClient({ url: "redis://:Brawl01man@kv-redis:6379/0" });

export async function connectRedis() {
  await client.connect();
  console.log("Redis client connected!");
}

client.on("error", (err: Error) => {
  console.error("Redis error:", err);
});

connectRedis().catch((error) => console.error(error));

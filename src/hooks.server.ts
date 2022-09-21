import {
  initializeRedisClient,
  isRedisClientInitialized,
} from "$lib/server/redis";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  if (event.url.pathname.startsWith("/api/") && !isRedisClientInitialized()) {
    await initializeRedisClient();
  }

  const response = await resolve(event);
  return response;
}

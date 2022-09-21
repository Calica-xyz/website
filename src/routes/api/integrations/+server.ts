import { getRedisClient } from "$lib/server/redis";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  let address = url.searchParams.get("address");

  let client = getRedisClient();
  try {
    let integrations = await client.json.get("integrations", {
      path: [`["${address}"]`],
    });
    return json(integrations);
  } catch (err) {
    return json({});
  }
}

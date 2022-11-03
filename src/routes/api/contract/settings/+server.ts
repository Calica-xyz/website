import { getContractSettings } from "$lib/server/utils";
import { json } from "@sveltejs/kit";

export async function GET({ url }) {
  const address = url.searchParams.get("address");

  try {
    let contractSettings = await getContractSettings(address);
    return json(contractSettings);
  } catch (err) {
    console.log("There was a problem getting contract settings:", err);
    return json({
      stakeholders: [],
    });
  }
}

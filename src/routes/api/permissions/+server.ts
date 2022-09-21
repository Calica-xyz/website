import { getRedisClient } from "$lib/server/redis";
import { getContractSettings } from "$lib/server/utils";
import { json } from "@sveltejs/kit";

export const prerender = false;

// Get the user's permissions for all contracts
export async function GET({ url }) {
  let address = url.searchParams.get("address");

  let client = getRedisClient();

  try {
    let permissions = await client.json.get("permissions", {
      path: [`["${address}"]`],
    });

    return json(permissions);
  } catch (err) {
    console.log(err);
    return json({});
  }
}
5;
export async function POST({ request }) {
  let { contractData, stakeholders } = await request.json();

  let client = getRedisClient();

  try {
    await Promise.all([
      initializeAddressPermissions(client, stakeholders),
      initializeContractSettings(client, contractData.address),
    ]);

    await Promise.all([
      updateUserPermissions(client, contractData, stakeholders),
      updateContractPermissions(client, contractData, stakeholders),
    ]);

    return json({ success: true });
  } catch (err) {
    console.log(err);
    return json({ success: false });
  }
}

// Set an empty object for the user's address if it doesn't exist
async function initializeAddressPermissions(client: any, addresses: string) {
  let initializedAddressPermRes = [];
  for (let address of addresses) {
    initializedAddressPermRes.push(
      client.json.set(
        "permissions",
        `$["${address}"]`,
        {},
        {
          NX: true,
        }
      )
    );
  }

  await Promise.all(initializedAddressPermRes);
}

// Set an empty object on the contract's settings if it doesn't exist
async function initializeContractSettings(
  client: any,
  contractAddress: string
) {
  let res = await client.json.set(
    "contractSettings",
    `$["${contractAddress}"]`,
    {},
    {
      NX: true,
    }
  );

  if (res != null)
    console.log("Initialized contract settings for: " + contractAddress);
}

// Add the contract details to the stakeholders' permissions and remove from the nonStakeholders
async function updateUserPermissions(client, contractData, stakeholders) {
  let currentContractSettings = await getContractSettings(contractData.address);
  let currentStakeholders =
    "stakeholders" in currentContractSettings
      ? currentContractSettings.stakeholders
      : [];
  let nonStakeholders = currentStakeholders.filter(
    (stakeholder) => !stakeholders.includes(stakeholder)
  );

  let contractDataPromises = [];
  for (let stakeholder of stakeholders) {
    contractDataPromises.push(
      client.json.set(
        "permissions",
        `$["${stakeholder}"]["${contractData.address}"]`,
        {
          contractName: contractData.name,
          contractChain: contractData.chain,
          contractType: contractData.type,
        }
      )
    );
  }

  for (let nonStakeholder of nonStakeholders) {
    contractDataPromises.push(
      client.json.del(
        "permissions",
        `$["${nonStakeholder}"]["${contractData.address}"]`
      )
    );
  }

  await Promise.all(contractDataPromises);
}

// Update the contract settings with the stakeholders
async function updateContractPermissions(client, contractData, stakeholders) {
  await client.json.set("contractSettings", `$["${contractData.address}"]`, {
    stakeholders,
  });

  console.log("Updated contract permissions for: " + contractData.address);
}

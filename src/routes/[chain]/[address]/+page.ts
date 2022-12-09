import { get } from "svelte/store";
import { signer } from "svelte-ethers-store";
import { ethers } from "ethers";

export const prerender = "auto";

/** @type {import('./$types').PageLoad} */
export async function load({ params, url, fetch }) {
  // TODO: Check local storage first

  let contractType = url.searchParams.get("type");
  let contractRequestURL = `/api/contract?address=${params.address}&chain=${params.chain}`;
  if (contractType) {
    contractRequestURL += `&type=${contractType}`;
  }

  let contractRequest = await fetch(contractRequestURL);

  let integrationRequest = await fetch(
    `/api/integrations?address=${params.address}`
  );

  let contractDataRequest = contractRequest.json();
  let integrationDataRequest = integrationRequest.json();

  let [contractData, integrationData] = await Promise.all([
    contractDataRequest,
    integrationDataRequest,
  ]);

  // TODO: Store contractData in local storage

  return {
    contractData,
    integrationData,
  };
}

export async function withdraw(
  withdrawType: string,
  address: string,
  calicaAddress: string,
  abi: any[],
  showMessage: (message: string, color: string) => void
) {
  switch (withdrawType) {
    case "direct":
      await directWithdraw(address, abi, showMessage);
      break;
    case "missocoolgirls":
      await missocoolgirlsWithdraw(address, calicaAddress, abi, showMessage);
      break;
    default:
      console.log("Unknown withdraw type");
  }
}

// Call a single withdraw function that transfers funds to the Calica Contract
async function directWithdraw(
  address: string,
  abi: any[],
  showMessage: (message: string, color: string) => void
) {
  let signerInstance = get(signer);
  let contract = new ethers.Contract(address, abi, signerInstance);

  try {
    // Call the NFT contract's withdraw function.
    let res = await contract[abi[0].name]();
    await res.wait();
  } catch (err) {
    console.log(err);
    showMessage(
      "There was a problem withdrawing directly from the revenue contract",
      "red"
    );
    return;
  }
}

// Custom withdraw function for the Miss O Cool Girls
// First, call the withdraw function. Then transfer the appropriate split to the Calica Contract.
async function missocoolgirlsWithdraw(
  address: string,
  calicaAddress: string,
  abi: any[],
  showMessage: (message: string, color: string) => void
) {
  let signerInstance = get(signer) as ethers.providers.JsonRpcSigner;
  let initialContractBalance = await signerInstance.provider.getBalance(
    address
  );
  let charitySplit = initialContractBalance.mul(26).div(100);
  let contract = new ethers.Contract(address, abi, signerInstance);

  try {
    // Call the NFT contract's withdraw function.
    // This will make internal transfers defined by a hardcoded split.
    let res = await contract[abi[0].name]();
    await res.wait();
  } catch (err) {
    console.log(err);
    showMessage("There was a problem withdrawing from the NFT contract", "red");
    return;
  }

  try {
    // Send the internal transferred amount to the Calica Contract
    let res = await signerInstance.sendTransaction({
      to: calicaAddress,
      value: charitySplit,
    });

    await res.wait();
    showMessage(
      "Funds withdrawn and distributed successfully. Refresh your dashboard to see the updated balance.",
      "green"
    );
  } catch (err) {
    console.log(err);
    showMessage(
      "There was a problem sending funds to the Calica Contract",
      "red"
    );
  }
}

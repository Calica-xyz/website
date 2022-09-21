import { browser } from "$app/environment";

export const prerender = "auto";

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
  // TODO: Enable this when listeners are implemented
  // if (browser) {
  //   let cachedContracts = localStorage.getItem(
  //     "my-contracts/" + params.address
  //   );
  //   if (cachedContracts != null) {
  //     return {
  //       deployedContracts: JSON.parse(cachedContracts),
  //     };
  //   }
  // }

  let res = await fetch(`/api/my-contracts?address=${params.address}`);
  let data = await res.json();

  let permissionedContracts = await fetch(
    `/api/permissions?address=${params.address}`
  );
  let jsonRes = await permissionedContracts.json();

  for (let [key, value] of Object.entries(jsonRes)) {
    data.push({
      blockNumber: 0,
      chain: value.contractChain,
      cloneAddress: key,
      contractName: value.contractName,
      contractType: value.contractType,
    });
  }

  // if (browser) {
  //   localStorage.setItem(
  //     "my-contracts/" + params.address,
  //     JSON.stringify(data)
  //   );
  // }

  return {
    deployedContracts: data,
  };
}

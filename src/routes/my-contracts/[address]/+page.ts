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

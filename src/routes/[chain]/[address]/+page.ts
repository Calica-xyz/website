export const prerender = "auto";

/** @type {import('./$types').PageLoad} */
export async function load({ params, url, fetch }) {
  // TODO: Check local storage first
  let res = await fetch(
    `/api/contract?address=${params.address}&chain=${
      params.chain
    }&type=${url.searchParams.get("type")}`
  );
  let data = await res.json();

  // TODO: Store in local storage

  return data;
}

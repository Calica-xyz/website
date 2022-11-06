export const prerender = "auto";

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
  const address = params.address;
  const baseUrl = "https://v4.subgraph.goerli.oceanprotocol.com";
  const route = "/subgraphs/name/oceanprotocol/ocean-subgraph";
  const url = `${baseUrl}${route}`;
  const query = `
  {
    tokens(where: {nft_: {owner: "${address.toLowerCase()}"}}) {
      symbol
      name
      address
    }
  }
    `;

  console.log(query);
  let deployedContracts = [];

  const queryRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  let res = await queryRes.json();
  if (res && res.errors && res.errors.length) {
    console.log(res.errors);
  }

  return {
    deployedContracts: parseDeployedContracts(res.data.tokens),
  };
}

function parseDeployedContracts(tokens: any[]) {
  let deployedContracts = [];

  for (let token of tokens) {
    deployedContracts.push({
      chain: "goerli",
      name: token.name,
      symbol: token.symbol,
      address: token.address,
    });
  }

  return deployedContracts;
}

async function queryGraphQL() {}

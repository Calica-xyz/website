import { getChainFromId } from "$lib/js/utils";

export const prerender = "auto";

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  const address = params.address;
  let aquariusRes = await queryAquarius(address);

  return {
    deployedContracts: aquariusRes,
  };
}

async function queryAquarius(address: string) {
  const baseUrl = "https://v4.aquarius.oceanprotocol.com";
  const route = "/api/aquarius/assets/query";
  const url = `${baseUrl}${route}`;
  const query = `
  {
    "from": 0,
    "query": {
        "bool": {
            "filter": [
                {
                    "term": {
                        "nft.owner": "${address.toLowerCase()}"
                    }
                },
                {
                    "terms": {
                        "chainId": [
                            80001,
                            137,
                            5,
                            1
                        ]
                    }
                },
                {
                    "term": {
                        "_index": "aquarius"
                    }
                }
            ]
        }
    },
    "sort": {
        "nft.created": "desc"
    }
  }`;

  const queryRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: query,
  });

  let res = await queryRes.json();
  if (res && res.errors && res.errors.length) {
    console.error("There was an error", res.errors);
  }

  return parseAquariusResponse(res.hits.hits);
}

function parseAquariusResponse(hits: any[]) {
  let deployedContracts = [];

  for (let hit of hits) {
    deployedContracts.push({
      chain: getChainFromId(hit._source.chainId),
      name: hit._source.metadata.name,
      address: hit._source.services[0].datatokenAddress,
    });
  }

  return deployedContracts;
}

// async function queryGraphQL(address: string) {
//   const baseUrl = "https://v4.subgraph.goerli.oceanprotocol.com";
//   const route = "/subgraphs/name/oceanprotocol/ocean-subgraph";
//   const url = `${baseUrl}${route}`;
//   const query = `
//   {
//     tokens(where: {nft_: {owner: "${address.toLowerCase()}"}}) {
//       symbol
//       name
//       address
//     }
//   }
//     `;
//   let deployedContracts = [];

//   const queryRes = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ query }),
//   });

//   let res = await queryRes.json();
//   if (res && res.errors && res.errors.length) {
//     console.log(res.errors);
//   }

//   return parseGraphQLResponse(res.data.tokens);
// }

// function parseGraphQLResponse(tokens: any[]) {
//   let deployedContracts = [];

//   for (let token of tokens) {
//     deployedContracts.push({
//       chain: "goerli",
//       name: token.name,
//       symbol: token.symbol,
//       address: token.address,
//     });
//   }

//   return deployedContracts;
// }
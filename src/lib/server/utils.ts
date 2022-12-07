import { getRollup } from "$lib/js/rollups";
import {
  convertTimestamp,
  convertWei,
  getContractInstance,
} from "$lib/js/utils";
import type { AlchemyProvider } from "@ethersproject/providers";
import { ethers, type Contract } from "ethers";
import type { Provider } from "@ethersproject/abstract-provider";
import type { Signer } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { getRedisClient } from "./redis";
import { SUPPORTED_TOKENS, TOKEN_DECIMALS } from "$lib/js/globals";

export async function getContractDeployedEvents(
  factoryContract: Contract,
  contractType: string,
  address: any,
  chain: string
) {
  let filter = factoryContract.filters.ContractDeployed(address, null, null);
  let events = await factoryContract.queryFilter(filter);

  let deployedContracts = [];
  for (let event of events) {
    let address = event.args.cloneAddress;
    let rollup = getRollup(address);

    if (rollup) {
      deployedContracts.push({
        blockNumber: event.blockNumber,
        contractName: rollup,
        contractType: "rollup",
        cloneAddress: rollup,
        chain,
      });
    } else {
      deployedContracts.push({
        blockNumber: event.blockNumber,
        contractName: event.args.contractName,
        contractType,
        cloneAddress: event.args.cloneAddress,
        chain,
      });
    }
  }

  return deployedContracts;
}

export function translateSplits(splits: any[]) {
  return splits.map(function (split: {
    account: any;
    name: any;
    percentage: { toNumber: () => number };
  }) {
    return {
      account: split.account,
      address: split.account,
      name: split.name,
      percentage: split.percentage.toNumber() / 1000,
    };
  });
}

export function translateExpenses(expenses: any) {
  return expenses.map(function (expense: {
    name: string;
    account: string;
    description: string;
    cost: any;
    amountPaid: any;
  }) {
    let decimals = TOKEN_DECIMALS[expense.tokenAddress];
    let cost = ethers.utils.formatUnits(expense.cost, decimals);
    let amountPaid = ethers.utils.formatUnits(expense.amountPaid, decimals);

    return {
      account: expense.account,
      address: expense.account,
      description: expense.description,
      name: expense.name,
      cost,
      amountPaid,
      tokenAddress: expense.tokenAddress,
    };
  });
}

export async function getBaseContractData(
  contractType: string,
  contract: Contract,
  factoryContract: Contract,
  provider: AlchemyProvider,
  address: any,
  chain: string
) {
  let ownerAddress = await contract.owner();
  let contractName = await contract.contractName();
  let reconfigurable = contractType == "expense";

  try {
    reconfigurable = await contract.isReconfigurable();
  } catch (err) {
    // Older contracts don't have this function

    // Exception for Miss O Cool Girls
    if (address == "0x4F3bb2Efa4C6Ff7090637c0Ca2c0bdE6fCa9454a") {
      reconfigurable = true;
    }
  }

  let deployFilter = factoryContract.filters.ContractDeployed(
    null,
    address,
    null
  );
  let deployEvents = await factoryContract.queryFilter(deployFilter);

  let deployDate = (await provider.getBlock(deployEvents[0].blockNumber))
    .timestamp;
  let withdrawalHistory = await getWithdrawalData(address, provider);

  let tokenBalances = await getTokenBalances(address, provider, chain);

  return {
    ownerAddress,
    contractName,
    deployDate,
    withdrawalHistory,
    reconfigurable,
    tokenBalances,
  };
}

// Gets the ERC20 + Native token balances for a given Calica Contract
export async function getTokenBalances(
  address: string,
  provider: Provider | Signer,
  chain: string
) {
  let nativeTokenBalance = await provider.getBalance(address);
  let tokenBalances = {
    [ethers.constants.AddressZero]: {
      symbol: chain == "homestead" || "goerli" ? "ETH" : "MATIC",
      balance: convertWei(nativeTokenBalance),
    },
  };

  for (let [tokenAddress, token] of Object.entries(SUPPORTED_TOKENS[chain])) {
    let tokenContract = new ethers.Contract(
      tokenAddress,
      '["function balanceOf(address owner) view returns (uint256)","function decimals() view returns (uint256)"]',
      provider
    );
    let balance = await tokenContract.balanceOf(address);
    let decimals = await tokenContract.decimals();

    if (balance > 0) {
      tokenBalances[tokenAddress] = {
        symbol: token,
        balance: ethers.utils.formatUnits(balance, decimals),
      };
    }
  }

  return tokenBalances;
}

export async function getWithdrawalData(
  address: string,
  provider: Provider | Signer
) {
  // Hardcoded ABIs for old + new withdrawal events
  // NOTE: new withdrawal events have tokenAddress for ERC20 support
  let filterContract = new ethers.Contract(
    address,
    '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"Withdrawal","type":"event"}]',
    provider
  );
  let withdrawFilter = filterContract.filters.Withdrawal();
  let withdrawalEvents = await filterContract.queryFilter(withdrawFilter);

  let newerFilterContract = new ethers.Contract(
    address,
    '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"}],"name":"Withdrawal","type":"event"}]',
    provider
  );
  let newerWithdrawFilter = newerFilterContract.filters.Withdrawal();
  let newerWithdrawalEvents = await newerFilterContract.queryFilter(
    newerWithdrawFilter
  );

  withdrawalEvents = withdrawalEvents.concat(newerWithdrawalEvents);

  console.log(withdrawalEvents);

  let retEvents = [];

  for (let withdrawalEvent of withdrawalEvents) {
    let decimals = TOKEN_DECIMALS[withdrawalEvent.args.tokenAddress];
    let amount = ethers.utils.formatUnits(
      withdrawalEvent.args.amount,
      decimals
    );

    retEvents.push({
      amount: parseFloat(amount),
      account: withdrawalEvent.args.account,
      timestamp: convertTimestamp(withdrawalEvent.args.timestamp),
      tokenAddress:
        withdrawalEvent.args.tokenAddress ||
        "0x0000000000000000000000000000000000000000",
    });
  }

  retEvents.sort(function (a, b) {
    return a.timestamp - b.timestamp;
  });

  return retEvents;
}

export function getAddressMappings(chartData: any, agreementType: string) {
  switch (agreementType) {
    case "simple":
      return getAddressMappingsFromSplits(chartData);
    case "capped":
      let addressMappings = {};
      for (let cappedSplit of chartData) {
        addressMappings = {
          ...addressMappings,
          ...getAddressMappingsFromSplits(cappedSplit.splits),
        };
      }
      return addressMappings;
    case "nft":
      return {
        ...getAddressMappingsFromSplits(chartData.primary),
        ...getAddressMappingsFromSplits(chartData.secondary),
      };
    default:
      return {};
  }
}

export function getAddressMappingsFromExpenses(
  expenses: any,
  profitAddress: string
) {
  let addressMappings = {};

  for (let expense of expenses) {
    addressMappings[expense.account] = expense.name;
  }

  if (!addressMappings[profitAddress]) {
    addressMappings[profitAddress] = "Profit Contract";
  }

  return addressMappings;
}

export function getAddressMappingsFromSplits(splits: any) {
  let addressMappings = {};

  for (let split of splits) {
    addressMappings[split.account] = split.name;
  }

  return addressMappings;
}

export async function getContractSettings(address: string) {
  let client = getRedisClient();

  try {
    let contractSettings = await client.json.get("contractSettings", {
      path: `$["${address}"]`,
    });

    return contractSettings.length == 0 ? {} : contractSettings[0];
  } catch (err) {
    console.log(err);
    return {};
  }
}

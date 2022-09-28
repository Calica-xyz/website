import { getRollup } from "$lib/js/rollups";
import {
  convertTimestamp,
  convertWei,
  getContractInstance,
} from "$lib/js/utils";
import { formatEther } from "ethers/lib/utils";
import { getRedisClient } from "./redis";

export async function getContractDeployedEvents(
  factoryContract,
  contractType,
  address,
  chain
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

export function translateSplits(splits) {
  return splits.map(function (split) {
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
    return {
      account: expense.account,
      address: expense.account,
      description: expense.description,
      name: expense.name,
      cost: parseFloat(formatEther(expense.cost)),
      amountPaid: parseFloat(formatEther(expense.amountPaid)),
    };
  });
}

export async function getBaseContractData(
  contractType,
  contract,
  factoryContract,
  provider,
  address
) {
  let ownerAddress = await contract.owner();
  let contractName = await contract.contractName();
  let reconfigurable = contractType == "expense";

  try {
    reconfigurable = await contract.isReconfigurable();
  } catch (err) {
    // Older contracts don't have this function
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

  return {
    ownerAddress,
    contractName,
    deployDate,
    withdrawalHistory,
    reconfigurable,
  };
}

export async function getWithdrawalData(address, provider) {
  // Hard coding simpleRevShare for now bc all contracts have the same withdrawal event
  let contract = getContractInstance(address, "simpleRevShare", provider);
  let withdrawFilter = contract.filters.Withdrawal();
  let withdrawalEvents = await contract.queryFilter(withdrawFilter);

  let retEvents = [];

  for (let withdrawalEvent of withdrawalEvents) {
    retEvents.push({
      amount: convertWei(withdrawalEvent.args.amount),
      account: withdrawalEvent.args.account,
      timestamp: convertTimestamp(withdrawalEvent.args.timestamp),
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

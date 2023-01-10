import { CALICA_FEE_ADDRESS, CONTRACT_TYPES } from "$lib/js/globals";
import { getRollupDetails } from "$lib/js/rollups";
import { getContractInstance, getFactoryContract } from "$lib/js/utils";
import {
  getAlchemyProvider,
  getValidationCloudProvider,
} from "$lib/server/nodeProvider";
import {
  getAddressMappings,
  getAddressMappingsFromExpenses,
  getBaseContractData,
  getWithdrawalData,
  translateExpenses,
  translateSplits,
} from "$lib/server/utils";
import { error, json } from "@sveltejs/kit";
import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const address = url.searchParams.get("address");
  const chain = url.searchParams.get("chain");
  let contractType = url.searchParams.get("type");

  if (!contractType) {
    contractType = await findContractType(address, chain);
  }

  let nodeProvider = getAlchemyProvider(chain);
  // let nodeProvider = getValidationCloudProvider(chain);

  if (contractType == "simple") {
    let contract = getContractInstance(address, "simpleRevShare", nodeProvider);
    let factoryContract = getFactoryContract(
      "simpleRevShareFactory",
      nodeProvider,
      chain
    );

    let splits = await contract.getSplits();
    splits = translateSplits(splits);

    return json(
      {
        agreementType: contractType,
        chartData: splits,
        addressMappings: getAddressMappings(splits, contractType),
        ...(await getBaseContractData(
          contractType,
          contract,
          factoryContract,
          nodeProvider,
          address,
          chain
        )),
      },
      {}
    );
  } else if (contractType == "capped") {
    let contract = getContractInstance(address, "cappedRevShare", nodeProvider);
    let factoryContract = getFactoryContract(
      "cappedRevShareFactory",
      nodeProvider,
      chain
    );

    let cappedSplits = await contract.getCappedSplits();
    cappedSplits = cappedSplits.map(function (cappedSplit: {
      cap: any;
      splits: any;
    }) {
      return {
        cap: parseFloat(formatEther(cappedSplit.cap)),
        splits: translateSplits(cappedSplit.splits),
      };
    });

    let addressMappings = getAddressMappings(cappedSplits, contractType);
    let tokenAddress = ethers.constants.AddressZero;

    try {
      tokenAddress = await contract.tokenAddress();
    } catch (err) {
      console.log(err);
    }

    let amountTransferred = await contract.amountTransferred();
    amountTransferred = parseFloat(formatEther(amountTransferred));

    return json({
      agreementType: contractType,
      chartData: cappedSplits,
      tokenAddress,
      amountTransferred,
      addressMappings,
      ...(await getBaseContractData(
        contractType,
        contract,
        factoryContract,
        nodeProvider,
        address,
        chain
      )),
    });
  } else if (contractType == "rollup") {
    let rollupDetails = getRollupDetails(address);
    let addressMappings = getAddressMappings(
      rollupDetails.chartData,
      rollupDetails.agreementType
    );

    let withdrawals: any[] = [];
    for (let address of rollupDetails.contracts) {
      withdrawals = [
        ...withdrawals,
        ...(await getWithdrawalData(address, nodeProvider)),
      ];
    }

    withdrawals.sort(function (a, b) {
      return a.timestamp - b.timestamp;
    });

    return json({
      contractName: address,
      ownerAddress: rollupDetails.ownerAddress,
      withdrawalHistory: withdrawals,
      agreementType: rollupDetails.agreementType,
      chartData: rollupDetails.chartData,
      addressMappings,
      reconfigurable: false,
    });
  } else if (contractType == "expense") {
    let contract = getContractInstance(
      address,
      "expenseSubmission",
      nodeProvider
    );
    let factoryContract = getFactoryContract(
      "expenseSubmissionFactory",
      nodeProvider,
      chain
    );

    let expenses = translateExpenses(await contract.getExpenses());

    let profitAddress = await contract.profitAddress();
    let addressMappings = getAddressMappingsFromExpenses(
      expenses,
      profitAddress
    );

    return json({
      agreementType: contractType,
      chartData: expenses,
      addressMappings,
      ...(await getBaseContractData(
        contractType,
        contract,
        factoryContract,
        nodeProvider,
        address,
        chain
      )),
      profitAddress,
    });
  } else if (contractType == "swap") {
    let contract = getContractInstance(address, "tokenSwap", nodeProvider);
    let factoryContract = getFactoryContract(
      "tokenSwapFactory",
      nodeProvider,
      chain
    );

    let tokenIn = await contract.tokenIn();
    let tokenOut = await contract.tokenOut();

    let profitAddress = await contract.profitAddress();
    let addressMappings = {
      [profitAddress]: "Profit Address",
      [CALICA_FEE_ADDRESS]: "Calica",
    };

    return json({
      agreementType: contractType,
      chartData: [tokenIn, tokenOut],
      addressMappings,
      ...(await getBaseContractData(
        contractType,
        contract,
        factoryContract,
        nodeProvider,
        address,
        chain
      )),
      profitAddress,
    });
  }

  throw error(500, "Unrecognized contract type");
}

async function findContractType(address: string, chain: string) {
  let nodeProvider = getAlchemyProvider(chain);

  for (let contractType of CONTRACT_TYPES) {
    try {
      let factoryName =
        contractType == "expense"
          ? "expenseSubmissionFactory"
          : contractType + "RevShareFactory";
      let factoryContract = getFactoryContract(
        factoryName,
        nodeProvider,
        chain
      );

      let filter = factoryContract.filters.ContractDeployed(
        null,
        address,
        null
      );
      let events = await factoryContract.queryFilter(filter);

      if (events.length) return contractType;
    } catch (err) {
      let errorMessage =
        "There was a problem looking up deploy events for contractType: " +
        contractType +
        " on chain: " +
        chain;
      console.log(errorMessage);
      // throw error(500, errorMessage);
    }
  }
}

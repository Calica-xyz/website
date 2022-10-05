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
import { formatEther } from "ethers/lib/utils";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const address = url.searchParams.get("address");
  const chain = url.searchParams.get("chain");
  const contractType = url.searchParams.get("type");

  // let alchemyProvider = getAlchemyProvider(chain);
  let nodeProvider = getValidationCloudProvider(chain);

  if (contractType == "simple") {
    let contract = getContractInstance(address, "simpleRevShare", nodeProvider);
    let factoryContract = getFactoryContract(
      "simpleRevShareFactory",
      nodeProvider,
      chain
    );

    let splits = await contract.getSplits();
    splits = translateSplits(splits);

    return json({
      agreementType: contractType,
      chartData: splits,
      addressMappings: getAddressMappings(splits, contractType),
      ...(await getBaseContractData(
        contractType,
        contract,
        factoryContract,
        nodeProvider,
        address
      )),
    });
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

    return json({
      agreementType: contractType,
      chartData: cappedSplits,
      addressMappings,
      ...(await getBaseContractData(
        contractType,
        contract,
        factoryContract,
        nodeProvider,
        address
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
        address
      )),
      profitAddress,
    });
  }

  throw error(500, "Unrecognized contract type");
}

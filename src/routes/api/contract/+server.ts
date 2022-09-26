import { getRollupDetails } from "$lib/js/rollups";
import { getContractInstance, getFactoryContract } from "$lib/js/utils";
import { getAlchemyProvider } from "$lib/server/nodeProvider";
import {
  getAddressMappings,
  getBaseContractData,
  getWithdrawalData,
  translateSplits,
} from "$lib/server/utils";
import { error, json } from "@sveltejs/kit";
import { formatEther } from "ethers/lib/utils";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const address = url.searchParams.get("address");
  const chain = url.searchParams.get("chain");
  const contractType = url.searchParams.get("type");

  let alchemyProvider = getAlchemyProvider(chain);

  if (contractType == "simple") {
    let contract = getContractInstance(
      address,
      "simpleRevShare",
      alchemyProvider
    );
    let factoryContract = getFactoryContract(
      "simpleRevShareFactory",
      alchemyProvider,
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
        alchemyProvider,
        address
      )),
    });
  } else if (contractType == "capped") {
    let contract = getContractInstance(
      address,
      "cappedRevShare",
      alchemyProvider
    );
    let factoryContract = getFactoryContract(
      "cappedRevShareFactory",
      alchemyProvider,
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
        alchemyProvider,
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
        ...(await getWithdrawalData(address, alchemyProvider)),
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
      alchemyProvider
    );
    let factoryContract = getFactoryContract(
      "expenseSubmissionFactory",
      alchemyProvider,
      chain
    );

    let expenses = await contract.getExpenses();
    expenses = expenses.map(function (expense: {
      name: string,
      account: string,
      cost: any,
      amountPaid: any
    }) {
      return {
        name: expense.name,
        account: expense.account,
        cost: parseFloat(formatEther(expense.cost)),
        amountPaid: parseFloat(formatEther(expense.amountPaid)),
      };
    });

    let addressMappings = getAddressMappings(expenses, contractType);

    return json({
      agreementType: contractType,
      chartData: expenses,
      addressMappings,
      ...(await getBaseContractData(
        contractType,
        contract,
        factoryContract,
        alchemyProvider,
        address
      )),
    });
  }

  throw error(500, "Unrecognized contract type");
}

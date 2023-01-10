import { TOKEN_DECIMALS, WETH_ADDRESS } from "$lib/js/globals";
import { ethers } from "ethers";

/** @type {import('./$types').PageLoad} */
export function load({}) {
  return {};
}

export function convertSimpleFormData(formData: any) {
  let filteredData = formData.simple.filter((split: any) => {
    return split.name && split.address && split.percentage;
  });

  let contractData = [formData.name];
  let splitsArr = [];

  for (let split of filteredData) {
    splitsArr.push([split.name, split.address, split.percentage * 1000]);
  }

  contractData.push(splitsArr);
  return contractData;
}

export function convertCappedFormData(formData: any) {
  let contractData = [formData.name];
  let cappedSplits = [];

  for (let i = 0; i < formData.capped.length; i++) {
    let formCappedSplit = formData.capped[i];
    let cappedSplit =
      i == 0 ? [0] : [ethers.utils.parseEther(formCappedSplit.cap.toString())];

    let splits: any = [];
    for (let split of formCappedSplit.splits) {
      if (split.name && split.address && split.percentage) {
        splits.push([split.name, split.address, split.percentage * 1000]);
      }
    }

    cappedSplit.push(splits);
    cappedSplits.push(cappedSplit);
  }

  contractData.push(cappedSplits);

  return contractData;
}

export function convertExpenseFormData(formData: any) {
  let contractData = [formData.name];
  let expenses = [];

  let filteredData = formData.expense.filter((expense: any) => {
    return (
      expense.name &&
      expense.address &&
      expense.cost &&
      expense.description &&
      expense.tokenAddress
    );
  });

  for (let expense of filteredData) {
    let decimals = TOKEN_DECIMALS[expense.tokenAddress];
    let cost = ethers.utils.parseUnits(expense.cost.toString(), decimals);

    expenses.push([
      expense.name,
      expense.address,
      cost,
      ethers.utils.parseEther("0"),
      expense.tokenAddress,
      expense.description,
    ]);
  }

  contractData.push(expenses);
  contractData.push(formData.profitAddress);

  return contractData;
}

export function convertSwapFormData(formData: any, chain: string) {
  console.log(formData);
  let contractName = formData.name;
  let tokenIn = formData.swap["0tokenAddress"];
  let tokenOut = formData.swap["1tokenAddress"];
  let wethAddress = WETH_ADDRESS[chain];
  let profitAddress = formData.profitAddress;

  // TODO: Pull this from the SUPPORTED_TOKEN_SWAPS
  let poolFee = 10000;

  let slippage = getSlippage(chain);

  return [
    contractName,
    tokenIn,
    tokenOut,
    wethAddress,
    profitAddress,
    poolFee,
    slippage,
  ];
}

// Slippage is out of 10000
function getSlippage(chain: string) {
  if (chain == "maticmum" || chain == "goerli") {
    return 0;
  }

  return 9950;
}

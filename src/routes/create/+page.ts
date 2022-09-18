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

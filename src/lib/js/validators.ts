import { utils } from "ethers";

function validatePercentage(percentage: number) {
  if (percentage <= 0) return "Must be > 0";

  if (!percentage) return null;

  if (percentage > 100) return "Must be <= 100";

  let percentageStr = percentage.toString();
  if (percentageStr.includes(".") && percentageStr.split(".")[1].length > 3) {
    return "Max 3 decimals";
  }

  return null;
}

function validateName(
  name: string,
  nameMap: object,
  address: string,
  percentage: string
) {
  if (!name) return percentage ? "Split needs name" : null;

  if (address && name in nameMap && nameMap[name] != address) {
    return "Name has different address";
  }

  nameMap[name] = address;

  return null;
}

function validateSplitAddress(
  address: string,
  addressMap: object,
  name: string,
  percentage: string
) {
  if (!address) return percentage ? "Split needs address" : null;

  if (!utils.isAddress(address)) {
    return "Invalid address";
  }

  if (name && address in addressMap && addressMap[address] != name) {
    return "Address has different name";
  }

  addressMap[address] = name;

  return null;
}

function validateCap(cap) {
  if (!cap) return "Can't be empty";
  if (cap <= 0) return "Must be > 0";

  return null;
}

function validateCost(cost) {
  if (cost <= 0) return "Must be > 0";
  if (!cost) return "Can't be empty";

  return null;
}

export function validateSplits(splits) {
  let errorMessages = [];
  let totalPercentages = 0;
  let nameMap = {},
    addressMap = {};

  if (!splits || splits.length == 0) {
    return errorMessages;
  }

  for (let split of splits) {
    if (split.percentage) {
      totalPercentages += split.percentage;
    }

    errorMessages.push({
      name: validateName(split.name, nameMap, split.address, split.percentage),
      address: validateSplitAddress(
        split.address,
        addressMap,
        split.name,
        split.percentage
      ),
      percentage: validatePercentage(split.percentage),
    });
  }

  if (totalPercentages != 100) {
    for (let errorMessage of errorMessages) {
      if (errorMessage.percentage == null) {
        errorMessage.percentage = "Splits must total 100";
      }
    }
  }

  for (let i = splits.length - 1; i >= 0; i--) {
    let hasDuplicateNameAddress = splits.some(function (item, index) {
      return (
        item.address == splits[i].address &&
        item.name == splits[i].name &&
        item.address != "" &&
        item.name != "" &&
        index != i
      );
    });

    if (hasDuplicateNameAddress) {
      if (errorMessages[i].name == null) {
        errorMessages[i].name = "Duplicate name/address";
      }
      if (errorMessages[i].address == null) {
        errorMessages[i].address = "Duplicate name/address";
      }

      break;
    }
  }

  return errorMessages;
}

export function validateExpenses(expenses: any) {
  if (!expenses || expenses.length == 0) return null;

  let errorMessages = [];

  for (let expense of expenses) {
    errorMessages.push({
      name: validateContractName(expense.name),
      address: validateAddress(expense.address),
      cost: validateCost(expense.cost),
    });
  }

  return errorMessages;
}

export function validateContractName(name: string) {
  if (!name || name == "") {
    return "Name required";
  }

  return null;
}

export function validateAddress(address: string) {
  if (!address || address == "") {
    return "Address is required";
  }

  if (!utils.isAddress(address)) {
    return "Invalid address";
  }

  return null;
}

export function validateCappedSplits(cappedSplits: any) {
  if (!cappedSplits || cappedSplits.length == 0) return null;

  let errorMessages = [];
  for (let i = 0; i < cappedSplits.length; i++) {
    errorMessages.push({
      cap: null,
      splits: null,
    });
  }

  for (let i = 0; i < cappedSplits.length; i++) {
    errorMessages[i].splits = validateSplits(cappedSplits[i].splits);
    if (i != 0) {
      errorMessages[i].cap = validateCap(cappedSplits[i].cap);
    }
  }

  let prevCap = 0;
  for (let i = 1; i < cappedSplits.length; i++) {
    if (cappedSplits[i].cap <= prevCap) {
      errorMessages[i].cap = "Must be > previous milestone";
    }
    prevCap = cappedSplits[i].cap;
  }

  return errorMessages;
}

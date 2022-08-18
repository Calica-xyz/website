import { ethers } from "ethers";

export function getReadableChain(chain: string) {
  switch (chain) {
    case "maticmum":
      return "Mumbai";
    case "matic":
      return "Polygon";
    case "homestead":
      return "Mainnet";
    case "goerli":
      return "Goerli";
  }
}

export function getRGB(name: string) {
  let style = getComputedStyle(document.body);
  let split = style.getPropertyValue(name).trim().split(" ");

  return `rgb(${split[0]},${split[1]},${split[2]})`;
}

export function getCurrency(chain: string) {
  if (chain == "maticmum" || chain == "matic") {
    return "MATIC";
  } else if (
    chain == "goerli" ||
    chain == "homestead"
  ) {
    return "ETH";
  } else return "";
}

export function roundNumber(number: number) {
  var factor = Math.pow(10, 12);
  return Math.round(number * factor) / factor;
}

export function convertWei(amount: ethers.BigNumber) {
  let convertedStr = ethers.utils.formatEther(amount);
  return Number.parseFloat(convertedStr);
}

export function convertTimestamp(timestamp: ethers.BigNumber) {
  return timestamp.toNumber();
}
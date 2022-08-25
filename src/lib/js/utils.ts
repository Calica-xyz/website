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

export function getReadableChainFromId(chainId: number) {
  switch (chainId) {
    case 1:
      return "Ethereum Mainnet";
    case 80001:
      return "Mumbai Testnet";
    case 137:
      return "Polygon Mainnet";
    case 5:
      return "Goerli Testnet";
    default:
      return "Unknown Network";
  }
}

export function getIconName(chainId: number) {
  if (chainId == 1 || chainId == 5) return "Eth";
  if (chainId == 137 || chainId == 80001) return "Polygon";
  return "";
}

export function getHexCode(name: string) {
  let style = getComputedStyle(document.body);
  return style.getPropertyValue(name).trim().replace(/['"]+/g, '');
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
import { ethers } from "ethers";
import { CONTRACT_ABIS, CONTRACT_ADDRESSES } from "./globals";

export function getContractInstance(
  address: string,
  contract: string,
  provider: ethers.Signer | ethers.providers.Provider
) {
  return new ethers.Contract(address, CONTRACT_ABIS[contract], provider);
}

export function getFactoryContract(
  contract: string,
  provider: ethers.Signer | ethers.providers.Provider,
  chain: string
) {
  return new ethers.Contract(
    CONTRACT_ADDRESSES[contract][chain],
    CONTRACT_ABIS[contract],
    provider
  );
}

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

export function getBadgeColor(chain: any) {
  switch (chain) {
    case "homestead":
      return "ethereum";
    case "goerli":
      return "ethereum";
    case "matic":
      return "polygon";
    case "maticmum":
      return "polygon";
    default:
      return "ethereum";
  }
}

export function getCurrency(chain: string | number) {
  if (typeof chain === "string") {
    if (chain == "maticmum" || chain == "matic") {
      return "MATIC";
    } else if (chain == "goerli" || chain == "homestead") {
      return "ETH";
    }
  } else {
    if (chain == 1 || chain == 5) {
      return "ETH";
    } else if (chain == 80001 || chain == 137) {
      return "MATIC";
    }
  }

  return "";
}

export function getChainFromId(chainId: number) {
  switch (chainId) {
    case 1:
      return "homestead";
    case 80001:
      return "maticmum";
    case 137:
      return "matic";
    case 5:
      return "goerli";
    default:
      return "";
  }
}

export function getIconName(chainId: number) {
  if (chainId == 1 || chainId == 5) return "Eth";
  if (chainId == 137 || chainId == 80001) return "Polygon";
  return "";
}

export function getHexCode(name: string) {
  let style = getComputedStyle(document.body);
  return style.getPropertyValue(name).trim().replace(/['"]+/g, "");
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

export function hexToRgbA(hex: string, alpha: number) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return (
      "rgba(" +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
      "," +
      alpha.toString() +
      ")"
    );
  }
  throw new Error("Bad Hex");
}

export async function getContractSettings(address: string) {
  let res = await fetch("/api/contract/settings?address=" + address);
  let data = await res.json();

  return data;
}

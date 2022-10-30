import simpleRevShareABI from "$lib/ABIs/RevenueShare.json";
import simpleRevShareFactoryABI from "$lib/ABIs/RevenueShareFactory.json";
import cappedRevShareABI from "$lib/ABIs/CappedRevenueShare.json";
import cappedRevShareFactoryABI from "$lib/ABIs/CappedRevenueShareFactory.json";
import expenseSubmissionABI from "$lib/ABIs/ExpenseSubmission.json";
import expenseSubmissionFactoryABI from "$lib/ABIs/ExpenseSubmissionFactory.json";

export const CONTRACT_ABIS = {
  simpleRevShare: simpleRevShareABI,
  simpleRevShareFactory: simpleRevShareFactoryABI,
  cappedRevShare: cappedRevShareABI,
  cappedRevShareFactory: cappedRevShareFactoryABI,
  expenseSubmission: expenseSubmissionABI,
  expenseSubmissionFactory: expenseSubmissionFactoryABI,
};

export const CONTRACT_ADDRESSES = {
  simpleRevShareFactory: {
    maticmum: "0x6C216E90069fA2f16773D9B40F18F58F83104803",
    goerli: "0x6aDb88aC6a86673F4590ec19f0C01b9AaCFd2043",
    homestead: "0x6adb88ac6a86673f4590ec19f0c01b9aacfd2043",
  },
  cappedRevShareFactory: {
    maticmum: "0x8fbFA1FA46dBbd8B52e894e418183549e7bB75c9",
    goerli: "0xFF7Bd8f4f1aF122240BBd62100096072fbBA4C1e",
  },
  expenseSubmissionFactory: {
    maticmum: "0x07964ccC51b105CBbC23Dc19859F290cfF75d7fc",
    goerli: "0x4bb53A186B7B78475D0A95796CdcF5dA9823D9cb",
  },
};

export const CONTRACT_TYPES = ["simple", "capped", "expense"];

export const SUPPORTED_NETWORKS = [
  "maticmum",
  "goerli",
  "homestead",
  // "matic",
];

export const SUPPORTED_TOKENS = {
  matic: {},
  maticmum: {},
  goerli: {
    "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc": "FAU",
  },
  homestead: {
    "0x6b175474e89094c44da98b954eedeac495271d0f": "DAI",
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "USDC",
    "0xdac17f958d2ee523a2206206994597c13d831ec7": "USDT",
    "0x967da4048cd07ab37855c090aaf366e4ce1b9f48": "OCEAN",
  },
};

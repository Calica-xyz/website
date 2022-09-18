import { ethers } from "ethers";

const ALCHEMY_KEYS = {
  goerli: "yYo5kcYx2vcUabvDNi0WT2NptWfInm6w",
  maticmum: "Jy4dLs8B7WeUuDz0_JSX0nA6afDFbn15",
  matic: "D3r6W3lvGMg5c0ekMvjKn1tTfApYr7i4",
  homestead: "oJmRebz4u9HB7tRb9p2SkXjgNY9YiE0B",
};

export function getAlchemyProvider(chain: string) {
  let key = ALCHEMY_KEYS[chain];
  return new ethers.providers.AlchemyProvider(chain, key);
}

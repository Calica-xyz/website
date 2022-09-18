import { ethers } from "ethers";
import { signer } from "svelte-ethers-store";
import { get } from "svelte/store";

// Calica Contract Address => Revenue-Generating Contract Details
const integrations = {
  "Boston Globe Demo": {
    revenueContractAddress: "0x024be45A189ee6cF53d7d67Ed5C4E115617c38d7",
    revenueContractName: "Boston Globe NFT Contract",
    withdrawHandler: async () => {
      let signerInstance = get(signer);
      let contract = new ethers.Contract(
        "0x024be45A189ee6cF53d7d67Ed5C4E115617c38d7",
        [
          {
            inputs: [],
            name: "withdrawMoney",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        signerInstance
      );

      await contract.withdrawMoney();
    },
  },
  "0x310ac8972D42c477504030c308eeFe865D8e8929": {
    revenueContractAddress: "0x627E5ba6543026404E02980C53957Ae47a16B604",
    revenueContractName: "Miss O Cool Girls NFT Contract",
    withdrawHandler: async (
      showMessage: (message: string, color: string | undefined) => void
    ) => {
      let signerInstance = get(signer);
      let initialContractBalance = await signerInstance.provider.getBalance(
        "0x627E5ba6543026404E02980C53957Ae47a16B604"
      );
      let charitySplit = initialContractBalance.mul(26).div(100);
      let contract = new ethers.Contract(
        "0x627E5ba6543026404E02980C53957Ae47a16B604",
        [
          {
            inputs: [],
            name: "withdraw",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        signerInstance
      );

      try {
        // Call the NFT contract's withdraw function.
        // This will make internal transfers defined by a hardcoded split.
        let res = await contract.withdraw();
        await res.wait();
      } catch (err) {
        console.log(err);
        showMessage(
          "There was a problem withdrawing from the NFT contract",
          "red"
        );
        return;
      }

      try {
        // Send the internal transferred amount to the Calica Contract
        let res = await signerInstance.sendTransaction({
          to: "0x310ac8972D42c477504030c308eeFe865D8e8929",
          value: charitySplit,
        });

        await res.wait();
        showMessage(
          "Funds withdrawn and distributed successfully. Refresh your dashboard to see the updated balance.",
          "green"
        );
      } catch (err) {
        console.log(err);
        showMessage(
          "There was a problem sending funds to the Calica Contract",
          "red"
        );
      }
    },
  },
};

export function getIntegration(address: string) {
  if (address in integrations) {
    return integrations[address];
  }

  return null;
}

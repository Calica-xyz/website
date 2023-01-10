<script lang="ts">
  import Configure from "$lib/Form/Configure/Configure.svelte";
  import ReviewDeploy from "$lib/Form/ReviewAndDeploy/ReviewDeploy.svelte";
  import ReconfigureSelection from "./ReconfigureSelection.svelte";
  import { getContractInstance } from "$lib/js/utils";
  import { ethers } from "ethers";
  import { signer } from "svelte-ethers-store";
  import { page } from "$app/stores";
  import { TOKEN_DECIMALS } from "$lib/js/globals";

  export let reconfigurable: boolean = false;
  export let pushETH: boolean = false;
  export let agreementType: string;
  export let contractName: string;
  export let chartData: any;
  export let profitAddress: string = "";
  export let tokenAddress: string = ethers.constants.AddressZero;
  export let amountTransferred: number = 0;

  let currentPage = 0;
  let pages = [ReconfigureSelection, Configure, ReviewDeploy];

  // This uses the create pagesState form values. Probably not the best way to do this...
  let pagesState = [
    {
      type: agreementType,
    },
    {
      name: contractName,
      profitAddress: new String(profitAddress),
      reconfigurable: reconfigurable.toString(),
      pushETH: pushETH.toString(),
      tokenAddress,
      [agreementType]: JSON.parse(JSON.stringify(chartData)),
    },
    {},
  ];

  let isDeploying: boolean = false;
  let showMessage: (message: string, color: string | undefined) => void;

  function onBack(values: any) {
    if (currentPage === 0) return;
    pagesState[currentPage] = { ...pagesState[currentPage], ...values };
    pagesState = pagesState; // Triggering update
    currentPage -= 1;
  }

  function convertSimpleFormData(formData: any) {
    let filteredData = formData.simple.filter(
      (split: { name: any; address: any; percentage: any }) => {
        return split.name && split.address && split.percentage;
      }
    );

    let splitsArr = [];

    for (let split of filteredData) {
      splitsArr.push([split.name, split.address, split.percentage * 1000]);
    }
    return splitsArr;
  }

  function convertCappedFormData(formData: any) {
    let cappedSplits: any[] = [];

    for (let i = 0; i < formData.capped.length; i++) {
      let formCappedSplit = formData.capped[i];
      let cappedSplit =
        i == 0
          ? [0]
          : [ethers.utils.parseEther(formCappedSplit.cap.toString())];

      let splits: any = [];
      for (let split of formCappedSplit.splits) {
        if (split.name && split.address && split.percentage) {
          splits.push([split.name, split.address, split.percentage * 1000]);
        }
      }

      cappedSplit.push(splits);
      cappedSplits.push(cappedSplit);
    }

    return cappedSplits;
  }

  function convertExpenseFormData(formData: any) {
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

      let amountPaid = ethers.utils.parseEther("0");
      if (expense.amountPaid) {
        amountPaid = ethers.utils.parseUnits(
          expense.amountPaid.toString(),
          decimals
        );
      }

      expenses.push([
        expense.name,
        expense.address,
        cost,
        amountPaid,
        expense.tokenAddress,
        expense.description,
      ]);
    }

    contractData.push(expenses);
    contractData.push(formData.profitAddress);

    return contractData;
  }

  function convertSwapFormData(formData: any) {
    let tokenIn = formData.swap["0tokenAddress"];
    let tokenOut = formData.swap["1tokenAddress"];
    let profitAddress = formData.profitAddress;

    // TODO: Pull this from the SUPPORTED_TOKEN_SWAPS
    let poolFee = 10000;

    return [profitAddress, tokenIn, tokenOut, poolFee];
  }

  async function onSubmit(values: any) {
    if (currentPage == pages.length - 1) {
      // On our final page, we transact with the smart contract factory
      isDeploying = true;

      let contractData;
      let contract;

      try {
        switch (agreementType) {
          case "simple":
            contractData = convertSimpleFormData(pagesState[1]);

            contract = getContractInstance(
              $page.params.address,
              "simpleRevShare",
              $signer
            );

            try {
              let res = await contract.reconfigureSplits(contractData);
              await res.wait();

              showMessage(
                "Transaction was successful. Refresh to see the new terms.",
                "green"
              );
            } catch (err) {
              console.log(err);
              showMessage(
                "There was a problem while reconfiguring the contract.",
                "red"
              );
            }
            break;

          case "capped":
            contractData = convertCappedFormData(pagesState[1]);

            contract = getContractInstance(
              $page.params.address,
              "cappedRevShare",
              $signer
            );

            try {
              let res = await contract.reconfigureCappedSplits(contractData);
              await res.wait();

              showMessage(
                "Transaction was successful. Refresh to see the new terms.",
                "green"
              );
            } catch (err) {
              console.log(err);
              showMessage(
                "There was a problem while reconfiguring the contract.",
                "red"
              );
            }
            break;

          case "expense":
            contractData = convertExpenseFormData(pagesState[1]);

            contract = getContractInstance(
              $page.params.address,
              "expenseSubmission",
              $signer
            );

            try {
              // params: expenses, profitAddresss
              let res = await contract.reconfigure(
                contractData[1],
                contractData[2].toString()
              );
              await res.wait();

              showMessage(
                "Transaction was successful. Refresh to see the new terms.",
                "green"
              );
            } catch (err) {
              console.log(err);
              showMessage(
                "There was a problem while reconfiguring the contract.",
                "red"
              );
            }
            break;

          case "swap":
            contractData = convertSwapFormData(pagesState[1]);

            contract = getContractInstance(
              $page.params.address,
              "tokenSwap",
              $signer
            );

            try {
              let res = await contract.reconfigure(
                contractData[0],
                contractData[1],
                contractData[2],
                contractData[3]
              );
              await res.wait();

              showMessage(
                "Transaction was successful. Refresh to see the new terms.",
                "green"
              );
            } catch (err) {
              console.log(err);
              showMessage(
                "There was a problem while reconfiguring the contract.",
                "red"
              );
            }
        }
      } catch (err) {
        console.log(err);
        showMessage(
          "There was a problem while reconfiguring the contract.",
          "red"
        );
      }

      isDeploying = false;
      return;
    } else {
      // If we're not on the last page, store our data and increase a step
      pagesState[currentPage] = { ...pagesState[currentPage], ...values };
      pagesState = pagesState; // Triggering update
      currentPage += 1;
    }
  }
</script>

<div class="m-8">
  {#if reconfigurable}
    <svelte:component
      this={pages[currentPage]}
      reconfiguring={true}
      {amountTransferred}
      bind:showMessage
      bind:isDeploying
      {onSubmit}
      {onBack}
      {pagesState}
      oldAgreementTerms={chartData}
      oldProfitAddress={profitAddress}
      initialValues={pagesState[currentPage]}
    />
  {:else}
    <h2 class="text-gray-600">Contract isn't reconfigurable</h2>
  {/if}
</div>

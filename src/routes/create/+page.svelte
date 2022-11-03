<script lang="ts">
  import ChooseContract from "$lib/Form/ChooseContract/ChooseContract.svelte";
  import Congrats from "$lib/Form/ReviewAndDeploy/Congrats.svelte";
  import Configure from "$lib/Form/Configure/Configure.svelte";
  import ReviewDeploy from "$lib/Form/ReviewAndDeploy/ReviewDeploy.svelte";
  import Steps from "$lib/Form/Steps.svelte";
  import { signer, chainId } from "svelte-ethers-store";
  import { getChainFromId, getFactoryContract } from "$lib/js/utils";
  import {
    convertCappedFormData,
    convertExpenseFormData,
    convertSimpleFormData,
  } from "./+page";

  const stepNames = ["Choose Contract", "Configure", "Review & Deploy"];

  let page = 0;
  let pages = [ChooseContract, Configure, ReviewDeploy, Congrats];
  let pagesState = [{}, {}, {}];
  let isDeploying: boolean = false;
  let deployAddress: string;
  let showMessage: (message: string, color: string | undefined) => void;

  $: chain = getChainFromId($chainId as number);

  async function onSubmit(values: any) {
    if (page == 2) {
      // On our final page, we transact with the smart contract factory
      isDeploying = true;

      let contractData;
      let factoryContract;

      try {
        switch (pagesState[0].type) {
          case "simple":
            contractData = convertSimpleFormData(pagesState[1]);

            factoryContract = getFactoryContract(
              "simpleRevShareFactory",
              $signer,
              chain
            );

            try {
              let res = await factoryContract.createNewRevenueShare(
                contractData,
                pagesState[1].reconfigurable == "true",
                pagesState[1].pushETH == "true"
              );
              let receipt = await res.wait();

              deployAddress = receipt.events[0].args[1];
              page += 1;
            } catch (err) {
              console.log(err);
              showMessage("There was a problem deploying the contract.", "red");
            }
            break;

          case "capped":
            contractData = convertCappedFormData(pagesState[1]);

            factoryContract = getFactoryContract(
              "cappedRevShareFactory",
              $signer,
              chain
            );

            try {
              let res = await factoryContract.createNewCappedRevenueShare(
                contractData,
                pagesState[1].reconfigurable == "true"
              );
              let receipt = await res.wait();

              deployAddress = receipt.events[0].args[1];
              page += 1;
            } catch (err) {
              console.log(err);
              showMessage("There was a problem deploying the contract.", "red");
            }
            break;

          case "expense":
            contractData = convertExpenseFormData(pagesState[1]);

            factoryContract = getFactoryContract(
              "expenseSubmissionFactory",
              $signer,
              chain
            );

            try {
              let res = await factoryContract.createNewExpenseSubmission(
                contractData
              );
              let receipt = await res.wait();

              deployAddress = receipt.events[0].args[1];
              page += 1;
            } catch (err) {
              console.log(err);
              showMessage("There was a problem deploying the contract.", "red");
            }
            break;
        }
      } catch (err) {
        console.log(err);
        showMessage("There was a problem deploying the contract.", "red");
      }

      isDeploying = false;
      return;
    } else {
      // If we're not on the last page, store our data and increase a step
      pagesState[page] = { ...pagesState[page], ...values };
      pagesState = pagesState; // Triggering update
      page += 1;
    }
  }

  function onBack(values: any) {
    if (page === 0) return;
    pagesState[page] = { ...pagesState[page], ...values };
    pagesState = pagesState; // Triggering update
    page -= 1;
  }
</script>

<svelte:head>
  <title>Create a Contract</title>
  <meta charset="utf-8" />
</svelte:head>

<div class="m-8 sm:px-12 ">
  <Steps {stepNames} currentStep={page} />
  <svelte:component
    this={pages[page]}
    bind:showMessage
    bind:isDeploying
    {deployAddress}
    {onSubmit}
    {onBack}
    {pagesState}
    initialValues={pagesState[page]}
  />
</div>

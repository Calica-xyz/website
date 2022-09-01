<script lang="ts">
  import ChooseContract from "$lib/Form/ChooseContract.svelte";
  import Congrats from "$lib/Form/Congrats.svelte";
  import Configure from "$lib/Form/Configure.svelte";
  import ReviewDeploy from "$lib/Form/ReviewDeploy.svelte";
  import Steps from "$lib/Form/Steps.svelte";
  import { ethers } from "ethers";
  import { signer, chainId } from "svelte-ethers-store";
  import { getChainFromId, getFactoryContract } from "$lib/js/utils";

  let stepNames = ["Choose Contract", "Configure", "Review & Deploy"];

  let page = 0;
  let pages = [ChooseContract, Configure, ReviewDeploy, Congrats];
  let pagesState = [{}, {}, {}];
  let isDeploying: boolean = false;
  let deployAddress;
  let show;

  $: chain = getChainFromId($chainId);

  function convertSimpleFormData(formData) {
    let filteredData = formData.simple.filter((split) => {
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

  function convertCappedFormData(formData) {
    let contractData = [formData.name];

    let cappedSplits = [];

    for (let i = 0; i < formData.capped.length; i++) {
      let formCappedSplit = formData.capped[i];
      let cappedSplit =
        i == 0
          ? [0]
          : [ethers.utils.parseEther(formCappedSplit.cap.toString())];

      let splits = [];
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

  async function onSubmit(values) {
    if (page == 2) {
      // On our final page, we transact with the smart contract factory
      isDeploying = true;

      let contractData;
      let factoryContract;

      switch (pagesState[0].type) {
        case "simple":
          contractData = convertSimpleFormData(pagesState[1]);

          factoryContract = getFactoryContract(
            "simpleRevShareFactory",
            $signer,
            chain
          );

          try {
            let res = await factoryContract.createNewRevenueShare(contractData);
            let receipt = await res.wait();

            deployAddress = receipt.events[0].args[1];
            page += 1;
          } catch (err) {
            show();
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
              contractData
            );
            let receipt = await res.wait();

            deployAddress = receipt.events[0].args[1];
            page += 1;
          } catch (err) {
            console.log(err);
            show();
          }
          break;
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

  function onBack(values) {
    if (page === 0) return;
    pagesState[page] = { ...pagesState[page], ...values };
    pagesState = pagesState; // Triggering update
    page -= 1;
  }
</script>

<div class="m-8">
  <Steps {stepNames} currentStep={page} />
  <svelte:component
    this={pages[page]}
    bind:show
    bind:isDeploying
    {deployAddress}
    {onSubmit}
    {onBack}
    {pagesState}
    initialValues={pagesState[page]}
  />
</div>

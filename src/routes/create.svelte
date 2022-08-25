<script lang="ts">
  import { signer } from "svelte-ethers-store";
  import ChooseContract from "$lib/Form/ChooseContract.svelte";
  import Congrats from "$lib/Form/Congrats.svelte";
  import simpleRevShareFactoryABI from "$lib/ABIs/RevenueShareFactory.json";
  import Configure from "$lib/Form/Configure.svelte";
  import ReviewDeploy from "$lib/Form/ReviewDeploy.svelte";
  import Steps from "$lib/Form/Steps.svelte";
  import { ethers } from "ethers";

  let stepNames = ["Choose Contract", "Configure", "Review & Deploy"];

  let page = 0;
  let pages = [ChooseContract, Configure, ReviewDeploy, Congrats];
  let pagesState = [{}, {}, {}];
  let isDeploying: boolean = false;
  let deployAddress;

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

  async function onSubmit(values) {
    if (page == 2) {
      // On our final page, we transact with the smart contract factory
      isDeploying = true;

      if (pagesState[0].type == "simple") {
        let contractData = convertSimpleFormData(pagesState[1]);

        let factoryContract = new ethers.Contract(
          "0x6C216E90069fA2f16773D9B40F18F58F83104803", // RevenueShareFactory address
          simpleRevShareFactoryABI,
          $signer
        );

        try {
          let res = await factoryContract.createNewRevenueShare(contractData);
          let receipt = await res.wait();

          deployAddress = receipt.events[0].args[1];
          page += 1;
        } catch (err) {
          // console.log(err);
          // TODO: Handle error message
        }
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
    bind:isDeploying
    {deployAddress}
    {onSubmit}
    {onBack}
    {pagesState}
    initialValues={pagesState[page]}
  />
</div>

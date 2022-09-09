<script lang="ts">
  import { createForm } from "felte";
  import { fly, fade } from "svelte/transition";
  import { chainId } from "svelte-ethers-store";

  import ButtonGroup from "$lib/Flowbite/ButtonGroup.svelte";
  import Review from "$lib/Form/Review.svelte";
  import TermsSignoff from "./TermsSignoff.svelte";
  import { reporter } from "@felte/reporter-svelte";
  import { Alert } from "flowbite-svelte";
  import Hidden from "$lib/Components/Hidden.svelte";
  import { SUPPORTED_NETWORKS } from "$lib/js/globals";
  import { getChainFromId } from "$lib/js/utils";

  export let initialValues;
  export let pagesState;
  export let onSubmit;
  export let onBack;
  export let isDeploying = false;

  export let show;
  let dismiss;

  $: onValidNetwork = SUPPORTED_NETWORKS.includes(getChainFromId($chainId));

  const { form, data } = createForm({
    extend: reporter,
    onSubmit,
    validate: (values) => {
      return {
        terms: values.terms ? null : "Please accept before deploying",
      };
    },
  });
</script>

<form use:form>
  <Hidden bind:show bind:dismiss>
    <div in:fade={{ duration: 300 }}>
      <Alert
        class="fixed top-24 right-10 w-[250px]"
        color="red"
        dismissable
        on:handleAlert={dismiss}
      >
        There was a problem deploying the contract. Please try again.
      </Alert>
    </div>
  </Hidden>

  <div
    in:fly={{ x: 500, duration: 500 }}
    class="flex flex-col gap-10 max-w-3xl mx-auto sm:px-12 my-4"
  >
    <div class="mb-6">
      <h3 class="text-gray-600">Review and Deploy Your Calica Contract</h3>
      <p class="subtitle-text text-gray-500">
        A smart contract will be deployed to the blockchain with the terms of
        your agreement
      </p>
    </div>

    <Review
      {onValidNetwork}
      name={pagesState[1].name}
      agreement={pagesState[0].type}
      agreementTerms={pagesState[1][pagesState[0].type]}
    />

    <div class="w-full">
      <TermsSignoff />
    </div>

    <ButtonGroup
      shouldDisableFinal={!onValidNetwork}
      isFinal={true}
      bind:isLoadingFinal={isDeploying}
      class="my-8 ml-auto"
      buttonNames={["Prev", "Deploy"]}
      buttonCallbacks={[() => onBack($data), () => {}]}
      buttonTypes={["button", onValidNetwork ? "submit" : "button"]}
    />
  </div>
</form>

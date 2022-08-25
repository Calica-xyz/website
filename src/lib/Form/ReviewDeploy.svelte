<script lang="ts">
  import { createForm } from "felte";
  import { fly } from "svelte/transition";
  import { chainId } from "svelte-ethers-store";

  import ButtonGroup from "$lib/Flowbite/ButtonGroup.svelte";
  import Review from "$lib/Form/Review.svelte";
  import TermsSignoff from "./TermsSignoff.svelte";
  import { reporter } from "@felte/reporter-svelte";

  export let initialValues;
  export let pagesState;
  export let onSubmit;
  export let onBack;

  const validNetworks = [80001];
  const { form, data } = createForm({
    extend: reporter,
    onSubmit,
    validate: (values) => {
      return {
        terms: values.terms ? null : "Please accept before deploying",
      };
    },
  });

  export let isDeploying = false;
  $: onValidNetwork = validNetworks.includes($chainId);
</script>

<form use:form>
  <div
    in:fly={{ x: 500, duration: 500 }}
    class="flex flex-col gap-10 max-w-3xl mx-auto sm:px-12 my-14"
  >
    <div>
      <h4 class="text-gray-600">Review and Deploy Your Calica Contract</h4>
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

    <TermsSignoff />

    <ButtonGroup
      shouldDisableFinal={!onValidNetwork}
      isFinal={true}
      bind:isLoadingFinal={isDeploying}
      class="mb-8 ml-auto"
      buttonNames={["Prev", "Deploy"]}
      buttonCallbacks={[() => onBack($data), () => {}]}
      buttonTypes={["button", "submit"]}
    />
  </div>
</form>

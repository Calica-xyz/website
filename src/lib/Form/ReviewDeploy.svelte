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
  import { page } from "$app/stores";

  export let initialValues;
  export let pagesState;
  export let onSubmit;
  export let onBack;
  export let isDeploying = false;
  export let reconfiguring = false;
  export let oldAgreementTerms = [];
  export let showError;
  export let showSuccess;

  let dismissError;
  let dismissSuccess;

  $: onValidNetwork = isOnValidNetwork($chainId);

  const { form, data } = createForm({
    extend: reporter,
    onSubmit,
    validate: (values) => {
      return {
        terms: values.terms ? null : "Please accept before deploying",
      };
    },
  });

  function isOnValidNetwork(chainId) {
    let chain = getChainFromId(chainId);
    let onSupportedNetwork = SUPPORTED_NETWORKS.includes(chain);
    let onDeployNetwork = reconfiguring ? $page.params.chain == chain : true;

    return onSupportedNetwork && onDeployNetwork;
  }
</script>

<form use:form>
  <Hidden bind:show={showError} bind:dismiss={dismissError}>
    <div in:fade={{ duration: 300 }}>
      <Alert
        class="fixed top-20 right-10 w-[250px]"
        color="red"
        dismissable
        on:handleAlert={dismissError}
      >
        {reconfiguring
          ? "There was a problem while reconfiguring the contract."
          : "There was a problem deploying the contract."}
      </Alert>
    </div>
  </Hidden>

  <Hidden bind:show={showSuccess} bind:dismiss={dismissSuccess}>
    <div in:fade={{ duration: 300 }}>
      <Alert
        class="fixed top-20 right-10 w-[250px]"
        color="green"
        dismissable
        on:handleAlert={dismissSuccess}
      >
        {"Transaction was successful. Refresh to see the new terms."}
      </Alert>
    </div>
  </Hidden>

  <div class="flex flex-col gap-10 max-w-3xl mx-auto sm:px-12 my-4">
    <div class="mb-6">
      <h3 class="text-gray-600">
        {reconfiguring ? "Review and Reconfigure" : "Review and Deploy"}
      </h3>
      <p class="subtitle-text text-gray-500">
        {reconfiguring
          ? "Your calica contract will now use the terms below."
          : "A smart contract will be deployed to the blockchain with the terms of your agreement."}
      </p>
    </div>

    <Review
      {onValidNetwork}
      name={pagesState[1].name}
      agreement={pagesState[0].type}
      agreementTerms={pagesState[1][pagesState[0].type]}
      {oldAgreementTerms}
      reconfigurable={pagesState[1].reconfigurable == "true"}
      {reconfiguring}
    />

    <div class="w-full">
      <TermsSignoff reconfigurable={pagesState[1].reconfigurable == "true"} />
    </div>

    <ButtonGroup
      shouldDisableFinal={!onValidNetwork}
      isFinal={true}
      bind:isLoadingFinal={isDeploying}
      class="my-8 ml-auto"
      buttonNames={["Prev", reconfiguring ? "Reconfigure" : "Deploy"]}
      buttonCallbacks={[() => onBack($data), () => {}]}
      buttonTypes={[
        "button",
        onValidNetwork && !isDeploying ? "submit" : "button",
      ]}
    />
  </div>
</form>

<script lang="ts">
  import ButtonGroup from "$lib/Flowbite/ButtonGroup.svelte";
  import TermsTable from "./TermsTable.svelte";
  import TermsSignoff from "./TermsSignoff.svelte";
  import AlertMessage from "$lib/Components/AlertMessage.svelte";
  import { createForm } from "felte";
  import { chainId } from "svelte-ethers-store";
  import { reporter } from "@felte/reporter-svelte";
  import { SUPPORTED_NETWORKS } from "$lib/js/globals";
  import { getChainFromId } from "$lib/js/utils";
  import { page } from "$app/stores";

  export let pagesState: any[];
  export let onSubmit: (values: any) => void;
  export let onBack: (values: any) => void;
  export let isDeploying = false;
  export let reconfiguring = false;
  export let oldAgreementTerms: any = [];
  export let oldProfitAddress: string = "";
  export let showMessage: (message: string, color: string | undefined) => void;

  $: onValidNetwork = isOnValidNetwork($chainId as number);

  const { form, data } = createForm({
    extend: reporter,
    onSubmit,
    validate: (values) => {
      return {
        terms: values.terms ? null : "Please accept before deploying",
      };
    },
  });

  function isOnValidNetwork(chainId: number) {
    let chain = getChainFromId(chainId);
    let onSupportedNetwork = SUPPORTED_NETWORKS.includes(chain);
    let onDeployNetwork = reconfiguring ? $page.params.chain == chain : true;

    return onSupportedNetwork && onDeployNetwork;
  }
</script>

<form use:form>
  <AlertMessage bind:showMessage />

  <div class="flex flex-col gap-10 max-w-4xl mx-auto sm:px-12 my-4">
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

    <TermsTable
      {onValidNetwork}
      name={pagesState[1].name}
      tokenAddress={pagesState[1].tokenAddress}
      profitAddress={pagesState[1].profitAddress}
      agreement={pagesState[0].type}
      agreementTerms={pagesState[1][pagesState[0].type]}
      {oldAgreementTerms}
      {oldProfitAddress}
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

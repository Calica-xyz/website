<script lang="ts">
  import { signerAddress, chainId } from "svelte-ethers-store";
  import { fade } from "svelte/transition";
  import { getReadableChainFromId, getIconName } from "$lib/js/utils";
  import { Alert, Tooltip } from "flowbite-svelte";
  import { InformationCircle } from "svelte-heros";
  import Polygon from "$lib/CustomIcons/Polygon.svelte";
  import Eth from "$lib/CustomIcons/Eth.svelte";

  export let name: string;
  export let agreement: string;
  export let onValidNetwork: boolean = false;
  export let agreementTerms: object[];

  function getAgreementTitles() {
    switch (agreement) {
      case "simple":
        return [
          "Basic Revenue Share Agreement",
          "Funds are split between earners",
        ];
      case "capped":
        return [
          "Milestone-based Revenue Share Agreement",
          "Funds are distributed to earners differently once milestones are hit",
        ];
      default:
        return ["Agreement", ""];
    }
  }

  function getAgreementText() {
    switch (agreement) {
      case "simple":
        let simpleStr = "";
        agreementTerms = agreementTerms.filter((split) => {
          return split.name && split.address && split.percentage;
        });

        for (let term of agreementTerms) {
          simpleStr += `${term.name}: ${term.percentage}% &nbsp;&nbsp;`;
        }
        return simpleStr;
      case "capped":
        let cappedStr = "";
        return cappedStr;
      default:
        return "";
    }
  }

  let titles = getAgreementTitles();
  let agreementText = getAgreementText();
  $: chainIconName = getIconName($chainId);
</script>

<div
  class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white shadow overflow-hidden"
>
  <div class="px-4 py-5 sm:px-6">
    <h5 class="leading-6 text-gray-600">
      {titles[0]}
    </h5>
    <p class="mt-1 max-w-2xl text-sm text-gray-500">
      {titles[1]}
    </p>
  </div>
  <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
    <dl class="sm:divide-y sm:divide-gray-200">
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Contract Name</dt>
        <dd
          class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
          style="overflow-wrap: anywhere;"
        >
          {name}
        </dd>
      </div>
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Owner Address</dt>
        <dd
          class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
          style="overflow-wrap: anywhere;"
        >
          {$signerAddress}
        </dd>
      </div>
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Chain</dt>
        <dd
          class="flex flex-wrap gap-x-4 gap-y-2 items-center mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
        >
          <div class="items-center flex gap-2">
            {getReadableChainFromId($chainId)}
            {#if chainIconName == "Polygon"}
              <Polygon size="20" />
            {:else if chainIconName == "Eth"}
              <Eth size="20" />
            {/if}
          </div>

          {#if !onValidNetwork}
            <div in:fade>
              <Alert class="p-2 mb-0 " color="red"
                >Unsupported Network
                <div class="inline-block">
                  <Tooltip
                    class="max-w-[200px] "
                    content="Calica currently only supports Polygon Testnet. Please sign in to a supported blockchain."
                    trigger="hover"
                  >
                    <InformationCircle class="inline mb-[2px]" size="17" />
                  </Tooltip>
                </div>
              </Alert>
            </div>
          {/if}
        </dd>
      </div>
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Calica Fee</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">0%</dd>
      </div>
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Terms</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          {@html agreementText}
        </dd>
      </div>
    </dl>
  </div>
</div>

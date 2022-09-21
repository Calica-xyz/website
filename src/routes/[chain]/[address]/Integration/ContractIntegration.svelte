<script lang="ts">
  import Button from "$lib/Flowbite/Button.svelte";
  import Card from "$lib/Flowbite/Card.svelte";
  import ChainBadge from "$lib/Icons/ChainBadge.svelte";
  import CopyButton from "$lib/Components/CopyButton.svelte";
  import Spinner from "$lib/Flowbite/Spinner.svelte";
  import AlertMessage from "$lib/Components/AlertMessage.svelte";
  import { convertWei, roundNumber } from "$lib/js/utils";
  import { signer, signerAddress } from "svelte-ethers-store";
  import { page } from "$app/stores";
  import { withdraw } from "../+page";

  export let integrationData: any;

  $: isTransacting = false;
  $: currentBalance = "";
  $: canWithdraw =
    integrationData.allowedCallers == "*" ||
    (typeof integrationData.allowedCallers == "object" &&
      $signerAddress in integrationData.allowedCallers);

  let isIntegrated =
    integrationData != null && Object.keys(integrationData).length > 0;
  let showMessage: (message: string, color: string | undefined) => void;

  if (isIntegrated) {
    updateBalance(integrationData.revenueContractAddress);
  }

  async function updateBalance(address: string) {
    if ($signer && $signer.provider) {
      currentBalance = roundNumber(
        convertWei(await $signer.provider.getBalance(address))
      ).toString();
    }
  }
</script>

<div class="m-8">
  {#if isIntegrated}
    <div class="flex flex-col gap-10">
      <div>
        <h2 class="text-gray-700">Integrated Contract</h2>
        <p class="subtitle-text text-gray-500">
          Your Calica contract is connected. You can now withdraw and distribute
          funds.
        </p>
      </div>

      <Card class="p-8 flex flex-col gap-2 max-w-[500px]">
        <div class="flex justify-between gap-4">
          <h4>{integrationData.revenueContractName}</h4>
          <ChainBadge class="self-start" chain={$page.params.chain} />
        </div>

        <div class="flex flex-1">
          <p class="text-gray-500 mr-2">Address:</p>
          <CopyButton
            class="truncate max-w-[200px]"
            text={integrationData.revenueContractAddress}
          />
        </div>
        <p class="text-gray-500 ">
          Current Balance: <span class="font-semibold"
            >{currentBalance} ETH</span
          >
        </p>
      </Card>

      {#if canWithdraw}
        <Button
          on:click={async () => {
            isTransacting = true;

            await withdraw(
              integrationData.withdrawType,
              integrationData.revenueContractAddress,
              $page.params.address,
              integrationData.abi,
              showMessage
            );

            isTransacting = false;

            updateBalance(integrationData.revenueContractAddress);
          }}
          class="mt-4 max-w-[220px]"
          >Distribute Funds
          {#if isTransacting}
            <Spinner class="ml-3" size="4" color="white" />
          {/if}
        </Button>
      {/if}
    </div>

    <AlertMessage bind:showMessage />
  {:else}
    <h2 class="text-gray-600">No contract integration set up yet</h2>
  {/if}
</div>

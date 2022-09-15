<script lang="ts">
  import Button from "$lib/Flowbite/Button.svelte";
  import Card from "$lib/Flowbite/Card.svelte";
  import ChainBadge from "./ChainBadge.svelte";
  import CopyButton from "./CopyButton.svelte";
  import { convertWei, getContractInstance, roundNumber } from "$lib/js/utils";
  import { signer } from "svelte-ethers-store";
  import { page } from "$app/stores";

  let currentBalance = "";

  let contract = getContractInstance(
    "0x024be45A189ee6cF53d7d67Ed5C4E115617c38d7",
    "demoNFTContract",
    $signer
  );

  async function updateBalance() {
    currentBalance = roundNumber(convertWei(await contract.getBalance()));
  }

  updateBalance();

  async function withdraw() {
    await contract.withdrawMoney();
    updateBalance();
  }
</script>

<div class="m-8">
  {#if $page.params.address == "Boston Globe Demo"}
    <div class="flex flex-col gap-10">
      <div>
        <h2 class="text-gray-700">Integrated Contract</h2>
        <p class="subtitle-text text-gray-500">
          Your Calica contract is connected. You can now withdraw and distribute
          funds to all earners.
        </p>
      </div>

      <Card class="p-8 flex flex-col gap-2 max-w-[500px]">
        <div class="flex justify-between gap-4">
          <h4>Boston Globe NFT Contract</h4>
          <ChainBadge class="self-start" chain="goerli" />
        </div>

        <div class="flex flex-1">
          <p class="text-gray-500 mr-2">Address:</p>
          <CopyButton
            class="truncate max-w-[200px]"
            text="0x463AD760A9e7c51181BC154b996f765400598398"
          />
        </div>
        <p class="text-gray-500 ">
          Current Balance: <span class="font-semibold"
            >{currentBalance} ETH</span
          >
        </p>
      </Card>

      <Button on:click={withdraw} class="mt-4 max-w-[200px]"
        >Distribute Funds</Button
      >
    </div>
  {:else}
    <h2 class="text-gray-600">No contract integration set up yet</h2>
  {/if}
</div>

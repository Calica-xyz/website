<script lang="ts">
  import Button from "$lib/Flowbite/Button.svelte";
  import { Dropdown, DropdownItem, Chevron, Input } from "flowbite-svelte";
  import { ethers } from "ethers";
  import { SUPPORTED_TOKENS } from "$lib/js/globals";
  import { chainId } from "svelte-ethers-store";
  import { getChainFromId, getTokenSymbol } from "$lib/js/utils";
  import { onMount } from "svelte";

  import TokenIcon from "$lib/Icons/TokenIcon.svelte";

  export let tokenAddress: string = ethers.constants.AddressZero;
  export let formPrefix: string = "";
  export let setData: any;
  export let disabled: boolean;

  $: chain = getChainFromId($chainId);
  $: tokens = [
    ethers.constants.AddressZero,
    ...Object.keys(SUPPORTED_TOKENS[chain]),
  ];

  let dropdownOpen = false;
  let selectedToken = getTokenSymbol(tokenAddress, getChainFromId($chainId));

  onMount(() => {
    setData(formPrefix + "tokenAddress", tokenAddress);
  });
</script>

<Button {disabled} class="rounded-l-none rounded-r-lg px-2" color="alternative">
  <Chevron><TokenIcon size="17" token={selectedToken} /></Chevron>
</Button>
<Dropdown bind:open={dropdownOpen}>
  {#each tokens as token}
    <div
      on:click={() => {
        dropdownOpen = false;
        selectedToken = getTokenSymbol(token, chain);
        setData(formPrefix + "tokenAddress", token);
      }}
    >
      <DropdownItem
        ><div class="flex gap-2 items-center">
          <TokenIcon token={getTokenSymbol(token, chain)} />
          {getTokenSymbol(token, chain)}
        </div></DropdownItem
      >
    </div>
  {/each}
</Dropdown>

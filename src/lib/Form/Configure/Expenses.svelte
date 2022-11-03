<script lang="ts">
  import Button from "$lib/Flowbite/Button.svelte";
  import Expense from "./Expense.svelte";
  import { fade } from "svelte/transition";
  import { X, Plus } from "svelte-heros";
  import { signerAddress } from "svelte-ethers-store";
  import { ethers } from "ethers";

  export let list: any[] = [
    {
      name: "Owner",
      address: $signerAddress,
      description: "First Expense",
      cost: "",
      tokenAddress: ethers.constants.AddressZero,
    },
  ];
  export let formPrefix = "";
  export let setData: any;

  function add() {
    list = [
      ...list,
      {
        name: "",
        address: "",
        description: "",
        cost: "",
        tokenAddress: ethers.constants.AddressZero,
      },
    ];
  }

  function remove(i: number) {
    list = [...list.slice(0, i), ...list.slice(i + 1)];
  }
</script>

<div class={`${$$props.class} flex flex-col gap-y-10 sm:gap-y-4`}>
  {#each list as item, i (`${formPrefix}.${i}.`)}
    <div in:fade class="flex gap-x-5 items-center">
      <Expense
        id={`${formPrefix}.${i}.`}
        class="flex-1"
        listIndex={i}
        formPrefix={`${formPrefix}.${i}.`}
        bind:name={item.name}
        bind:address={item.address}
        bind:description={item.description}
        bind:cost={item.cost}
        bind:tokenAddress={item.tokenAddress}
        amountPaid={item.amountPaid}
        {setData}
        disabled={item.amountPaid > 0}
      />
      {#if item.amountPaid && item.amountPaid > 0}
        <div class="w-[38px] h-[40px]" />
      {:else}
        <Button
          on:click={() => remove(i)}
          color="accent"
          outline={true}
          class="!p-2 h-10"><X size="20" /></Button
        >
      {/if}
    </div>
  {/each}

  <Button
    color="primary"
    on:click={add}
    outline={true}
    class="focus:ring-0 border-dashed w-full"><Plus size="20" /></Button
  >
</div>

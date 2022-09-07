<script lang="ts">
  export let name: string;
  export let contractType: string;
  export let address: string;
  export let chain: string;

  import Button from "$lib/Flowbite/Button.svelte";
  import {
    ChartPie,
    ChartBar,
    Collection,
    ArrowNarrowRight,
  } from "svelte-heros";
  import Card from "$lib/Flowbite/Card.svelte";
  import ChainBadge from "$lib/Components/ChainBadge.svelte";

  let link = `/${chain}/${address}?type=${contractType}`;
</script>

<Card class="relative max-w-[500px] min-w-[245px]">
  <div class="flex flex-col gap-2 justify-between h-full">
    <div class="mr-6 absolute right-0 inline-block">
      <ChainBadge {chain} />
    </div>

    <a href={link}>
      {#if contractType == "simple"}
        <ChartPie class="text-gray-300" size="100" />
      {:else if contractType == "capped"}
        <ChartBar class="text-gray-300" size="100" />
      {:else if contractType == "rollup"}
        <Collection class="text-gray-300" size="100" />
      {/if}
    </a>

    <div>
      <h3 class="text-gray-600">{name}</h3>
    </div>

    <a href={link}>
      <Button color="primary" outline class="mt-5 w-[200px]"
        >View Contract<ArrowNarrowRight size="18" class="ml-2" /></Button
      >
    </a>
  </div>
</Card>

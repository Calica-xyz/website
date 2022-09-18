<script lang="ts">
  import { ChartBar, ChartPie, Collection } from "svelte-heros";

  export let size: string;
  export let contractType: string;

  const contractTypeIcons: { [key: string]: any } = {
    simple: ChartPie,
    capped: ChartBar,
    rollup: Collection,
  };
</script>

{#if contractTypeIcons[contractType]}
  <svelte:component
    this={contractTypeIcons[contractType]}
    class={$$props.class}
    {size}
  />
{/if}

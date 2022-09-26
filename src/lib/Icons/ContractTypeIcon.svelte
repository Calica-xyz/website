<script lang="ts">
  import { Calculator, ChartBar, ChartPie, Collection } from "svelte-heros";

  export let size: string;
  export let contractType: string;

  const contractTypeIcons: { [key: string]: any } = {
    simple: ChartPie,
    capped: ChartBar,
    expense: Calculator,
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

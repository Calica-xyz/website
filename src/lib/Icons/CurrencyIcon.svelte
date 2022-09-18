<script lang="ts">
  import Eth from "$lib/Icons/Eth.svelte";
  import Polygon from "$lib/Icons/Polygon.svelte";
  import { getIconName } from "$lib/js/utils";
  import { chainId } from "svelte-ethers-store";

  export let size = "20";

  $: iconName = getIconName($chainId as number);
</script>

{#if iconName == "Eth"}
  <Eth {size} />
{:else if iconName == "Polygon"}
  <Polygon {size} />
{/if}

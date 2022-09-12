<script lang="ts">
  import Eth from "$lib/CustomIcons/Eth.svelte";

  import Polygon from "$lib/CustomIcons/Polygon.svelte";
  import { getIconName } from "$lib/js/utils";
  import { chainId } from "svelte-ethers-store";

  export let size = "20";

  $: iconName = getIconName($chainId);
</script>

{#if iconName == "Eth"}
  <Eth {size} />
{:else if iconName == "Polygon"}
  <Polygon {size} />
{/if}

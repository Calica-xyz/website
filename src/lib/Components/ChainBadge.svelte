<script lang="ts">
  export let chain: string;
  export let large = false;

  import Badge from "$lib/Flowbite/Badge.svelte";
  import Eth from "$lib/CustomIcons/Eth.svelte";
  import Polygon from "$lib/CustomIcons/Polygon.svelte";
  import { getReadableChain } from "$lib/js/utils";

  function getBadgeColor() {
    switch (chain) {
      case "homestead":
        return "ethereum";
      case "goerli":
        return "ethereum";
      case "matic":
        return "polygon";
      case "maticmum":
        return "polygon";
      default:
        return "ethereum";
    }
  }
</script>

<Badge color={getBadgeColor()} {large} class={$$props.class}
  >{getReadableChain(chain)}

  {#if chain == "maticmum" || chain == "matic"}
    <Polygon class="ml-1" size="12" />
  {:else if chain == "goerli" || chain == "homestead"}
    <Eth class="ml-1" size="12" />
  {/if}
</Badge>

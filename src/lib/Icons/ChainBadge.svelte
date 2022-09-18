<script lang="ts">
  import Badge from "$lib/Flowbite/Badge.svelte";
  import Eth from "$lib/Icons/Eth.svelte";
  import Polygon from "$lib/Icons/Polygon.svelte";
  import { getReadableChain, getBadgeColor } from "$lib/js/utils";

  export let chain: string;
  export let large = false;
</script>

<Badge color={getBadgeColor(chain)} {large} class={$$props.class}
  >{getReadableChain(chain)}

  {#if chain == "maticmum" || chain == "matic"}
    <Polygon class="ml-1" size="12" />
  {:else if chain == "goerli" || chain == "homestead"}
    <Eth class="ml-1" size="12" />
  {/if}
</Badge>

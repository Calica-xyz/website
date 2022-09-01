<script lang="ts">
  export let chain: string;
  export let large = false;

  import Badge from "$lib/Flowbite/Badge.svelte";
  import Eth from "$lib/CustomIcons/Eth.svelte";
  import Polygon from "$lib/CustomIcons/Polygon.svelte";
  import { getReadableChain, getBadgeColor } from "$lib/js/utils";
</script>

<Badge color={getBadgeColor(chain)} {large} class={$$props.class}
  >{getReadableChain(chain)}

  {#if chain == "maticmum" || chain == "matic"}
    <Polygon class="ml-1" size="12" />
  {:else if chain == "goerli" || chain == "homestead"}
    <Eth class="ml-1" size="12" />
  {/if}
</Badge>

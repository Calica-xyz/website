<script lang="ts">
  import Card from "$lib/Flowbite/Card.svelte";
  import { chainId } from "svelte-ethers-store";
  import { getTokenSymbol } from "$lib/js/utils";
  import TokenIcon from "$lib/Icons/TokenIcon.svelte";
  import TokenDropdown from "$lib/Form/Configure/TokenDropdown.svelte";
  import { ArrowRight } from "svelte-heros";

  export let isOwner: boolean;
  export let data: any;
  export let chain: string;

  let tokenSymbol0 = getTokenSymbol(data["0tokenAddress"], chain);
  let tokenSymbol1 = getTokenSymbol(data["1tokenAddress"], chain);
</script>

<Card class={`${$$props.class}`} style="min-width: min(250px, 100%);">
  <h4 class="mb-6">Token Swap</h4>
  <div class="flex-1 flex items-center gap-4 justify-center">
    <div class="flex flex-col gap-4 justify-center items-center max-w-[500px]">
      <TokenIcon token={tokenSymbol0} size="100" />
      {tokenSymbol0}
    </div>
    <ArrowRight size="40" class="text-gray-600" />
    <div class="flex flex-col gap-4 justify-center items-center max-w-[500px]">
      <TokenIcon token={tokenSymbol1} size="100" />
      {tokenSymbol1}
    </div>
  </div>
</Card>

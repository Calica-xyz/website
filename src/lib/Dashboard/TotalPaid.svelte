<script lang="ts">
  export let amount: number;
  export let currency: string;
  export let isOwner: boolean;

  import Card from "$lib/Flowbite/Card.svelte";
</script>

<Card class={`text-center ${$$props.class}`}>
  {#if isOwner}
    <h5>Total Earned</h5>
  {:else}
    <h5>Your Earnings</h5>
  {/if}

  <h1 class="truncate text-ellipsis">
    {amount}
    <p class="subtitle-text">{currency}</p>
  </h1>
</Card>

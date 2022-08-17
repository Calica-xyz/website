<script>
  export let amount;
  export let currency;

  let className = "";
  export { className as class };

  export let isOwner;

  import Card from "$lib/Flowbite/Card.svelte";
</script>

<Card class="{className} text-center">
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

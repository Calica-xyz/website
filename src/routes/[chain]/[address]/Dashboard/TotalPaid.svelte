<script lang="ts">
  import Card from "$lib/Flowbite/Card.svelte";

  export let amount: number;
  export let currency: string;
  export let isOwner: boolean;
</script>

<Card class={`text-center ${$$props.class}`}>
  {#if isOwner}
    <h5>Total Paid</h5>
  {:else}
    <h5>Total Earned</h5>
  {/if}

  <h1 class="truncate text-ellipsis">
    {amount}
    <p class="subtitle-text">{currency}</p>
  </h1>
</Card>

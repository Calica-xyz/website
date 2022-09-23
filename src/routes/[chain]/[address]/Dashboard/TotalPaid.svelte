<script lang="ts">
  import Card from "$lib/Flowbite/Card.svelte";

  export let amount: number;
  export let currency: string;
</script>

<Card class={`text-center ${$$props.class}`}>
  <h5>Total Received</h5>

  <h1 class="truncate text-ellipsis">
    {amount}
    <p class="subtitle-text">{currency}</p>
  </h1>
</Card>

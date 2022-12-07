<script lang="ts">
  import Card from "$lib/Flowbite/Card.svelte";
  import TokenIcon from "$lib/Icons/TokenIcon.svelte";

  export let totalAmountsPaid: any;

  console.log(totalAmountsPaid);
</script>

<Card class={`${$$props.class}`}>
  <h5>Total Distributed</h5>

  <div class="pr-[10px] mr-[-10px] mt-3 max-h-[97px] overflow-y-auto">
    {#each Object.entries(totalAmountsPaid) as [amountPaid, amount]}
      <div class="pt-1 mb-1 flex flex-row gap-x-6 justify-between">
        <div class="flex flex-row gap-x-2">
          <TokenIcon token={amountPaid} />
          <p>{amountPaid}</p>
        </div>

        <p>{amount}</p>
      </div>
    {/each}
  </div>
</Card>

<script>
  import ContractCard from "$lib/Components/ContractCard.svelte";

  /** @type {import('./$types').PageData} */
  export let data;
</script>

<div class="m-10 sm:mx-20">
  <h2 class="text-gray-600">My Contracts</h2>

  <div
    class="mt-8 grid gap-8"
    style="grid-template-columns: repeat(auto-fill, minmax(245px, 1fr));"
  >
    {#each data.deployedContracts as deployedContract}
      <ContractCard
        name={deployedContract.contractName}
        contractType={deployedContract.contractType}
        address={deployedContract.cloneAddress}
        chain={deployedContract.chain}
      />
    {/each}
  </div>
</div>

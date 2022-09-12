<script>
  import ContractCard from "$lib/Components/ContractCard.svelte";

  /** @type {import('./$types').PageData} */
  export let data;
</script>

<div class="bg-white">
  <!-- Header -->
  <div class="relative pb-32">
    <div class="absolute inset-0">
      <img
        class="h-full w-full object-cover"
        src="/PeopleBackground.avif"
        alt=""
      />
      <div
        class="absolute inset-0 bg-gray-800 mix-blend-multiply"
        aria-hidden="true"
      />
    </div>
    <div
      class="relative mx-auto max-w-7xl py-20 px-6 sm:py-20 sm:px-10 lg:px-8"
    >
      <h1
        class="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
      >
        My Contracts
      </h1>
      <p class="mt-4 max-w-3xl text-md text-gray-300">
        All of the Calica contracts you own and earn from
      </p>
    </div>
  </div>

  <!-- Overlapping cards -->
  <section
    class="relative z-10 mx-auto -mt-32 max-w-7xl px-4 pb-32 sm:px-6 lg:px-8"
    aria-labelledby="contact-heading"
  >
    <h2 class="sr-only" id="contact-heading">My Contracts</h2>
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
  </section>
</div>

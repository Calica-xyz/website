<script>
    import ContractCard from "$lib/Components/ContractCard.svelte";
    export let deployedContracts;
</script>

<div class="m-10 sm:mx-20">
    <h2 class="text-gray-600">My Contracts</h2>

    <div class="mt-8 flex gap-12 flex-wrap justify-center sm:justify-start">
        {#each deployedContracts as deployedContract}
            <ContractCard
                name={deployedContract.contractName}
                contractType={deployedContract.contractType}
                address={deployedContract.cloneAddress}
                chain={deployedContract.chain}
            />
        {/each}
    </div>
</div>

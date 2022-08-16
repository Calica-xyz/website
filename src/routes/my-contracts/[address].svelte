<script>
    import ContractCard from "$lib/Components/ContractCard.svelte";
    export let deployedContracts;
</script>

<div class="m-10">
    <h1>My Contracts</h1>

    <div class="mt-8">
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

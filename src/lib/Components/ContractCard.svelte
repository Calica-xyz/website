<script lang="ts">
    export let name: string;
    export let contractType: string;
    export let address: string;
    export let chain: string;

    import { Card } from "flowbite-svelte";
    import { ChartPie, ChartBar } from "svelte-heros";
    import Polygon from "$lib/CustomIcons/Polygon.svelte";
    import Eth from "$lib/CustomIcons/Eth.svelte";

    let backgroundColor =
        chain == "maticmum" || chain == "matic"
            ? "bg-[#8247e5]"
            : "bg-[#3c3c3d]";

    console.log(backgroundColor);
</script>

<Card href="/{chain}/{address}?type={contractType}" padding="none">
    <div class="{backgroundColor} rounded-t-lg">
        {#if contractType == "SimpleRevenueShare"}
            <ChartPie color="white" size="200" class="text-center m-auto p-2" />
        {:else if contractType == "CappedRevenueShare"}
            <ChartBar color="white" size="200" class="text-center m-auto p-2" />
        {/if}
    </div>
    <div class="py-4 px-6 flex justify-between items-center">
        <h2>{name}</h2>
        {#if chain == "maticmum" || chain == "matic"}
            <Polygon size="40" />
        {:else if chain == "homestead" || chain == "goerli"}
            <Eth size="40" />
        {/if}
    </div>
</Card>

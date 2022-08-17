<script>
    export let chain;
    export let large = false;

    let className = "";
    export { className as class };

    import { Badge } from "flowbite-svelte";
    import Eth from "$lib/CustomIcons/Eth.svelte";
    import Polygon from "$lib/CustomIcons/Polygon.svelte";

    let color = chain == "maticmum" || "matic" ? "purple" : "dark";

    function getReadable() {
        switch (chain) {
            case "maticmum":
                return "Mumbai";
            case "matic":
                return "Polygon";
            case "homestead":
                return "Mainnet";
            case "goerli":
                return "Goerli";
        }
    }
</script>

<Badge {color} {large} class={className}
    >{getReadable()}

    {#if chain == "maticmum" || chain == "matic"}
        <Polygon class="ml-1" size="12" />
    {:else if chain == "goerli" || chain == "homestead"}
        <Eth class="ml-1" size="12" />
    {/if}
</Badge>

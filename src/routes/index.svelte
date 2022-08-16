<script>
    import { signerAddress } from "svelte-ethers-store";
    import Loader from "$lib/Components/Loader.svelte";

    import { onMount } from "svelte";

    onMount(() => {
        window.location.href = "/my-contracts/" + $signerAddress;
    });
</script>

<Loader />

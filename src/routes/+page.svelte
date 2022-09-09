<script>
  import { signerAddress } from "svelte-ethers-store";
  import { goto } from "$app/navigation";
  import Loader from "$lib/Components/Loader.svelte";

  import { onMount } from "svelte";

  onMount(() => {
    goto("/my-contracts/" + $signerAddress);
  });
</script>

<Loader />

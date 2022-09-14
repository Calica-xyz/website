<script lang="ts">
  import { onMount } from "svelte";
  import Button from "$lib/Flowbite/Button.svelte";
  import { connectWeb3Modal } from "$lib/js/auth";

  let initialized = false;

  async function initializeWeb3() {
    await connectWeb3Modal();
    initialized = true;
  }

  onMount(() => {
    initializeWeb3();
  });
</script>

{#if initialized}
  <div class="grid h-screen place-items-center">
    <Button color="primary" on:click={initializeWeb3} class=""
      >Connect Wallet</Button
    >
  </div>
{/if}

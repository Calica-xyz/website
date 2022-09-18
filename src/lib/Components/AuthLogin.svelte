<script lang="ts">
  import Button from "$lib/Flowbite/Button.svelte";
  import { onMount } from "svelte";
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
  <div class="h-[calc(100vh-220px)] grid place-items-center">
    <Button on:click={initializeWeb3}>Connect Wallet</Button>
  </div>
{/if}

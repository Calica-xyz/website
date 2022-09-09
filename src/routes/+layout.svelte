<script lang="ts">
  import "../app.css";
  import AuthLogin from "$lib/Components/AuthLogin.svelte";
  import Navbar from "$lib/Navbar.svelte";
  import Footer from "$lib/Footer.svelte";
  import Loader from "$lib/Components/Loader.svelte";

  import { signerAddress } from "svelte-ethers-store";
  import { navigating, page } from "$app/stores";

  $: showFooter = $page.routeId != "[chain]/[address]";
</script>

{#if $signerAddress}
  <div class="flex min-h-screen flex-col justify-start">
    <div class="h-[64px]">
      <Navbar />
    </div>

    <div id="content-container" class="w-full h-full">
      {#if $navigating}
        <Loader />
      {:else}
        <slot />
      {/if}
    </div>

    {#if !$navigating && showFooter}
      <Footer />
    {/if}
  </div>
{:else}
  <AuthLogin />
{/if}

<style>
  #content-container {
    min-height: calc(100vh - 200px); /* Viewport - navbar + footer */
  }
</style>

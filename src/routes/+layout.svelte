<script lang="ts">
  import "../app.css";
  import AuthLogin from "$lib/Components/AuthLogin.svelte";
  import Analytics from "$lib/Components/Analytics.svelte";
  import Navbar from "$lib/Navbar.svelte";
  import Footer from "$lib/Footer.svelte";
  import Loader from "$lib/Components/Loader.svelte";

  import { signerAddress } from "svelte-ethers-store";
  import { navigating, page } from "$app/stores";

  $: showFooter = $page.routeId != "[chain]/[address]" && $page.routeId != "";
  $: showContent =
    $page.routeId == "blog" ||
    $page.routeId == "contact" ||
    $page.routeId == "";
  $: showNavbar = $page.routeId != "";
</script>

<Analytics />

<div class="flex min-h-screen flex-col justify-start">
  {#if showNavbar}
    <div class="h-[64px]">
      <Navbar />
    </div>
  {/if}

  <div id="content-container" class="w-full h-full">
    {#if $signerAddress || showContent}
      {#if $navigating}
        <Loader />
      {:else}
        <slot />
      {/if}
    {:else}
      <AuthLogin />
    {/if}
  </div>

  {#if !$navigating && showFooter}
    <Footer />
  {/if}
</div>

<style>
  #content-container {
    min-height: calc(100vh - 200px); /* Viewport - navbar + footer */
  }
</style>

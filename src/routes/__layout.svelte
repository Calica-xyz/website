<script type="ts">
  import "../app.css";
  import AuthLogin from "$lib/Components/AuthLogin.svelte";
  import Navbar from "$lib/Navbar.svelte";
  import Footer from "$lib/Footer.svelte";
  import Loader from "$lib/Components/Loader.svelte";

  import { connected } from "svelte-ethers-store";
  import { navigating } from "$app/stores";
</script>

{#if $connected}
  <div class="flex min-h-screen flex-col justify-start">
    <Navbar />

    <div id="content-container" class="w-full h-full">
      {#if $navigating}
        <Loader />
      {:else}
        <slot />
      {/if}
    </div>

    <Footer />
  </div>
{:else}
  <AuthLogin />
{/if}

<style>
  #content-container {
    min-height: calc(100vh - 263px); /* Viewport - navbar + footer */
  }
</style>

<script lang="ts">
  import SidebarLayout from "$lib/Dashboard/SidebarLayout.svelte";
  import Footer from "$lib/Footer.svelte";
  import Dashboard from "$lib/Dashboard/Dashboard.svelte";
  import ContractIntegration from "$lib/Components/ContractIntegration.svelte";

  /** @type {import('./$types').PageData} */
  export let data;

  let page = 0;
</script>

<svelte:head>
  <title>{data.contractName}</title>
  <meta charset="utf-8" />
</svelte:head>

<SidebarLayout bind:page>
  <div class="my-10 flex w-full justify-center">
    <div id="content-container" class="flex-1">
      {#if page === 0}
        <Dashboard {...data} />
      {:else if page === 1}
        <ContractIntegration />
      {:else if page === 2}{/if}
    </div>
  </div>

  <Footer />
</SidebarLayout>

<style>
  #content-container {
    max-width: min(1400px, calc(100% - 4rem));
    min-height: calc(100vh - 265px); /* Viewport - navbar - margin */
  }

  @media (max-width: 768px) {
    #content-container {
      max-width: min(1400px, calc(100% - 1rem));
      min-height: calc(
        100vh - 375px
      ); /* Viewport - navbar - margin - sidebar */
    }
  }
</style>

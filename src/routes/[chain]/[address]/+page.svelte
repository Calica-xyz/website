<script lang="ts">
  import SidebarLayout from "./Dashboard/SidebarLayout.svelte";
  import Footer from "$lib/Components/Footer.svelte";
  import Dashboard from "./Dashboard/Dashboard.svelte";
  import ContractIntegration from "./Integration/ContractIntegration.svelte";
  import ReconfigureContract from "./Reconfigure/ReconfigureContract.svelte";
  import Settings from "./Settings/Settings.svelte";

  /** @type {import('./$types').PageData} */
  export let data;

  let integrationData = data.integrationData;
  let contractData = data.contractData;
  let currentPage = 0;
</script>

<svelte:head>
  <title>{contractData.contractName}</title>
  <meta charset="utf-8" />
</svelte:head>

<SidebarLayout
  bind:page={currentPage}
  ownerAddress={contractData.ownerAddress}
  reconfigurable={contractData.reconfigurable}
>
  <div class="my-6 flex w-full justify-center">
    <div id="content-container" class="h-full flex-1">
      {#if currentPage === 0}
        <Dashboard {...contractData} />
      {:else if currentPage === 1}
        <ContractIntegration {integrationData} />
      {:else if currentPage === 2}
        <ReconfigureContract {...contractData} />
      {:else if currentPage === 3}
        <Settings contractName={contractData.contractName} />
      {/if}
    </div>
  </div>

  <Footer />
</SidebarLayout>

<style>
  #content-container {
    /* max-width: min(1400px, calc(100% - 4rem)); */
    min-height: calc(100vh - 265px); /* Viewport - navbar - margin */
  }

  @media (max-width: 768px) {
    #content-container {
      /* max-width: min(1400px, calc(100% - 1rem)); */
      min-height: calc(
        100vh - 375px
      ); /* Viewport - navbar - margin - sidebar */
    }
  }
</style>

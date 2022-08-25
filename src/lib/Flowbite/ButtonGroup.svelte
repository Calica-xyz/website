<script lang="ts">
  import Spinner from "./Spinner.svelte";

  export let buttonNames: string[];
  export let buttonCallbacks: (() => void)[];
  export let buttonTypes: string[];
  export let isFinal: boolean = false;
  export let isLoadingFinal: boolean = false;
  export let shouldDisableFinal: boolean = false;

  $: disabledClasses = shouldDisableFinal
    ? "cursor-not-allowed opacity-50"
    : "";
</script>

<div class={`${$$props.class} inline-flex rounded-md shadow-sm`} role="group">
  <button
    on:click={buttonCallbacks[0]}
    type={buttonTypes[0]}
    class="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 hover:text-primary focus:z-10 focus:ring-4 focus:ring-secondary-300 focus:text-primary-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-primary-500 dark:focus:text-white"
  >
    {buttonNames[0]}
  </button>

  {#each Array(buttonNames.length - 2) as i, index (index)}
    <button
      on:click={buttonCallbacks[i + 1]}
      type={buttonTypes[i + 1]}
      class="py-2 px-4 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-primary focus:z-10 focus:ring-4 focus:ring-secondary-300 focus:text-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-primary dark:focus:text-white"
    >
      {buttonNames[i + 1]}
    </button>
  {/each}

  {#if isFinal}
    <!-- TODO: Make button use tones of primary color -->
    <button
      on:click={buttonCallbacks[buttonCallbacks.length - 1]}
      type={buttonTypes[buttonTypes.length - 1]}
      class={`${disabledClasses} py-2 px-4 text-sm font-medium text-white bg-primary-700 rounded-r-md border border-primary hover:bg-primary-800 focus:z-10 focus:ring-4 focus:ring-secondary-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-primary dark:focus:text-white`}
    >
      {buttonNames[buttonNames.length - 1]}
      {#if isLoadingFinal}
        <Spinner class="mr-1" size="4" color="white" />
      {/if}
    </button>
  {:else}
    <button
      on:click={buttonCallbacks[buttonCallbacks.length - 1]}
      type={buttonTypes[buttonTypes.length - 1]}
      class="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-secondary-300 focus:text-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-primary dark:focus:text-white"
    >
      {buttonNames[buttonNames.length - 1]}
    </button>
  {/if}
</div>

<script lang="ts">
  import ConfigureCapped from "$lib/Form/ConfigureCapped.svelte";
  import ConfigureSimple from "$lib/Form/ConfigureSimple.svelte";

  export let initialValues;
  export let pagesState;
  export let onSubmit;
  export let onBack;
</script>

{#if pagesState[0].type == "simple"}
  <ConfigureSimple {initialValues} {pagesState} {onSubmit} {onBack} />
{:else}
  <ConfigureCapped {initialValues} {pagesState} {onSubmit} {onBack} />
{/if}

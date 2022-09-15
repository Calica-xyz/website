<script lang="ts">
  import ConfigureCapped from "$lib/Form/ConfigureCapped.svelte";
  import ConfigureSimple from "$lib/Form/ConfigureSimple.svelte";

  export let reconfiguring: boolean = false;
  export let initialValues;
  export let pagesState;
  export let onSubmit;
  export let onBack;

  console.log(initialValues);
</script>

{#if pagesState[0].type == "simple"}
  <ConfigureSimple
    {initialValues}
    {pagesState}
    {onSubmit}
    {onBack}
    {reconfiguring}
  />
{:else if pagesState[0].type == "capped"}
  <ConfigureCapped
    {initialValues}
    {pagesState}
    {onSubmit}
    {onBack}
    {reconfiguring}
  />
{/if}

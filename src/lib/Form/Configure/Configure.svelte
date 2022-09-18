<script lang="ts">
  import ConfigureCapped from "./ConfigureCapped.svelte";
  import ConfigureSimple from "./ConfigureSimple.svelte";

  export let reconfiguring: boolean = false;
  export let initialValues: any;
  export let pagesState: any[];
  export let onSubmit: (values: any) => void;
  export let onBack: (values: any) => void;

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
  <ConfigureCapped {initialValues} {onSubmit} {onBack} {reconfiguring} />
{/if}

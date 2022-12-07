<script lang="ts">
  import ConfigureCapped from "./ConfigureCapped.svelte";
  import ConfigureSimple from "./ConfigureSimple.svelte";
  import ConfigureExpense from "./ConfigureExpense.svelte";

  export let reconfiguring: boolean = false;
  export let amountTransferred = 0;
  export let initialValues: any;
  export let pagesState: any[];
  export let onSubmit: (values: any) => void;
  export let onBack: (values: any) => void;
</script>

{#if pagesState[0].type == "simple"}
  <ConfigureSimple {initialValues} {onSubmit} {onBack} {reconfiguring} />
{:else if pagesState[0].type == "capped"}
  <ConfigureCapped
    {initialValues}
    {onSubmit}
    {onBack}
    {reconfiguring}
    {amountTransferred}
  />
{:else if pagesState[0].type == "expense"}
  <ConfigureExpense {initialValues} {onSubmit} {onBack} {reconfiguring} />
{/if}

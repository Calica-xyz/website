<script lang="ts">
  import { createForm } from "felte";
  import ButtonGroup from "$lib/Flowbite/ButtonGroup.svelte";
  import { ChartPie, ChartBar, ChevronRight } from "svelte-heros";

  export let initialValues;
  export let onSubmit;
  export let onBack;

  const { form, data } = createForm({ onSubmit });
</script>

<form use:form>
  <ButtonGroup
    class="mb-8 float-right"
    buttonNames={["Prev", "Next"]}
    buttonCallbacks={[() => onBack($data), () => {}]}
    buttonTypes={["button", "submit"]}
  />
</form>

<script lang="ts">
  import { createForm } from "felte";
  import { fly } from "svelte/transition";
  import ButtonGroup from "$lib/Flowbite/ButtonGroup.svelte";

  export let initialValues;
  export let pagesState;
  export let onSubmit;
  export let onBack;

  const { form, data } = createForm({ onSubmit });
</script>

<form use:form>
  <div in:fly={{ x: 500, duration: 500 }} class="max-w-2xl mx-auto my-14">
    <h4 class="text-gray-600">Milestone-based Revenue Share Agreement</h4>
    <p class="subtitle-text text-gray-500">
      Create earning milestones with different splits
    </p>

    <ButtonGroup
      class="mb-8 float-right"
      buttonNames={["Prev", "Next"]}
      buttonCallbacks={[() => onBack($data), () => {}]}
      buttonTypes={["button", "submit"]}
    />
  </div>
</form>

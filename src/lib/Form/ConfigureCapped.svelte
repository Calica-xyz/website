<script lang="ts">
  import { createForm } from "felte";
  import { fly } from "svelte/transition";
  import ButtonGroup from "$lib/Flowbite/ButtonGroup.svelte";
  import CappedSplits from "./CappedSplits.svelte";
  import { reporter, ValidationMessage } from "@felte/reporter-svelte";
  import FloatingLabelInput from "$lib/Flowbite/FloatingLabelInput.svelte";
  import { Helper } from "flowbite-svelte";
  import {
    validateCappedSplits,
    validateContractName,
  } from "$lib/js/validators";

  export let initialValues;
  export let pagesState;
  export let onSubmit;
  export let onBack;

  let name = initialValues.name;

  const { form, data } = createForm({
    extend: reporter,
    onSubmit,
    validate: (values) => {
      let errorMessages = {
        name: validateContractName(values.name),
        capped: validateCappedSplits(values.capped),
      };

      return errorMessages;
    },
  });
</script>

<form use:form>
  <div in:fly={{ x: 500, duration: 500 }} class="max-w-4xl mx-auto my-14">
    <h4 class="text-gray-600">Milestone-based Revenue Share Agreement</h4>
    <p class="subtitle-text text-gray-500 mb-8">
      Create earning milestones with different splits
    </p>

    <ValidationMessage for="name" let:messages={message}>
      <div class="max-w-[200px] mt-10 sm:my-14">
        <FloatingLabelInput
          color={message != null ? "red" : "base"}
          style="outlined"
          name="name"
          id="name"
          label="Contract Name"
          bind:value={name}
        />
        {#if message != null}
          <Helper class="mb-2 sm:mb-0" color="red">{message}</Helper>
        {/if}
      </div>
    </ValidationMessage>

    <CappedSplits
      class="mb-20"
      cappedSplits={initialValues.capped}
      formPrefix="capped"
    />

    <ButtonGroup
      class="mb-8 float-right"
      buttonNames={["Prev", "Next"]}
      buttonCallbacks={[() => onBack($data), () => {}]}
      buttonTypes={["button", "submit"]}
    />
  </div>
</form>

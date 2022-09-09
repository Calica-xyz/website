<script lang="ts">
  import { createForm } from "felte";
  import { fly } from "svelte/transition";
  import ButtonGroup from "$lib/Flowbite/ButtonGroup.svelte";
  import CappedSplits from "./CappedSplits.svelte";
  import { reporter, ValidationMessage } from "@felte/reporter-svelte";
  import FloatingLabelInput from "$lib/Flowbite/FloatingLabelInput.svelte";
  import Input from "$lib/Flowbite/Input.svelte";
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
  <div in:fly={{ x: 500, duration: 500 }} class="max-w-4xl mx-auto my-4">
    <h3 class="text-gray-600">Milestone-based Revenue Share Agreement</h3>
    <p class="subtitle-text text-gray-500 mb-8">
      Create earning milestones with different splits
    </p>

    <ValidationMessage for="name" let:messages={message}>
      <div class="mt-10 sm:my-14">
        <div class="flex flex-wrap gap-6 items-center">
          <h4 class="text-gray-600">Contract Name</h4>
          <Input
            color={message != null ? "red" : "base"}
            class="max-w-[200px]"
            style="outlined"
            name="name"
            id="name"
            bind:value={name}
          />
        </div>

        {#if message != null}
          <Helper class="absolute mb-2 sm:mb-0" color="red">{message}</Helper>
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

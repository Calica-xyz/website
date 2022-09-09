<script lang="ts">
  import { ValidationMessage } from "@felte/reporter-svelte";
  import { reporter } from "@felte/reporter-svelte";
  import { createForm } from "felte";
  import { fly } from "svelte/transition";
  import ButtonGroup from "$lib/Flowbite/ButtonGroup.svelte";
  import Doughnut from "$lib/Dashboard/Doughnut.svelte";
  import Splits from "$lib/Form/Splits.svelte";
  import Input from "$lib/Flowbite/Input.svelte";
  import { Helper } from "flowbite-svelte";
  import { validateContractName, validateSplits } from "$lib/js/validators";

  export let initialValues;
  export let pagesState;
  export let onSubmit;
  export let onBack;

  let name = initialValues.name;
  let doughnut;

  const { form, data } = createForm({
    extend: reporter,
    onSubmit,
    validate: (values) => {
      let errorMessages = {
        name: validateContractName(values.name),
        simple: validateSplits(values.simple),
      };

      return errorMessages;
    },
  });
</script>

<form autocomplete="off" use:form>
  <div class="max-w-6xl mx-auto sm:px-12 my-4">
    <h3 class="text-gray-600">Basic Revenue Share Agreement</h3>
    <p class="subtitle-text text-gray-500">
      Add or remove earners with their split of revenue
    </p>

    <ValidationMessage for="name" let:messages={message}>
      <div class="mt-10 sm:my-14">
        <div class="flex flex-wrap gap-x-6 gap-y-2 items-center">
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

    <div class="flex flex-wrap gap-10 justify-center mb-10">
      <Splits
        bind:doughnut
        class="my-10 flex-1 min-w-[300px]"
        formPrefix={pagesState[0].type}
        list={initialValues.simple}
      />

      <div class="mt-[-20px] flex-1 max-w-md min-w-[300px] aspect-square">
        <Doughnut bind:this={doughnut} legendPosition={"top"} />
      </div>
    </div>

    <ButtonGroup
      class="mb-8 float-right"
      buttonNames={["Prev", "Next"]}
      buttonCallbacks={[() => onBack($data), () => {}]}
      buttonTypes={["button", "submit"]}
    />
  </div>
</form>

<script lang="ts">
  import ButtonGroup from "$lib/Flowbite/ButtonGroup.svelte";
  import Doughnut from "$lib/Components/Doughnut.svelte";
  import Splits from "./Splits.svelte";
  import Input from "$lib/Flowbite/Input.svelte";
  import Radio from "$lib/Flowbite/utils/Radio.svelte";
  import { ValidationMessage } from "@felte/reporter-svelte";
  import { reporter } from "@felte/reporter-svelte";
  import { createForm } from "felte";
  import { Helper } from "flowbite-svelte";
  import { validateContractName, validateSplits } from "$lib/js/validators";

  export let initialValues: any;
  export let onSubmit: (values: any) => void;
  export let onBack: (values: any) => void;
  export let reconfiguring = false;

  let name = initialValues.name;
  let reconfigurable = initialValues.reconfigurable || "true";
  let pushETH = initialValues.pushETH || "false";
  let doughnut: Doughnut;

  const { form, data } = createForm({
    extend: reporter,
    onSubmit,
    validate: (values: { name: string; simple: any }) => {
      let errorMessages = {
        name: validateContractName(values.name),
        simple: validateSplits(values.simple),
      };

      return errorMessages;
    },
  });
</script>

<form autocomplete="off" use:form>
  <div class="max-w-6xl mx-auto my-4">
    <h3 class="text-gray-600">Basic Revenue Share Agreement</h3>
    <p class="subtitle-text text-gray-500">
      Add or remove earners with their split of revenue
    </p>

    <div class="my-14">
      <ValidationMessage for="name" let:messages={message}>
        <div class="flex flex-wrap gap-x-6 gap-y-2 items-center">
          <h5 class="text-gray-600">Contract Name</h5>
          <Input
            color={message != null ? "red" : "base"}
            class="max-w-[200px]"
            style="outlined"
            name="name"
            id="name"
            bind:value={name}
            disabled={reconfiguring}
          />
        </div>

        {#if message != null}
          <Helper class="absolute mb-2 sm:mb-0" color="red">{message}</Helper>
        {/if}
      </ValidationMessage>

      <div class="flex flex-wrap gap-x-20 gap-y-2 items-center">
        {#if !reconfiguring}
          <div class="mt-6 flex gap-3">
            <p class="text-gray-600">Can the contract be reconfigured?</p>
            <Radio
              color="primary"
              name="reconfigurable"
              bind:group={reconfigurable}
              value="true">Yes</Radio
            >
            <Radio
              name="reconfigurable"
              bind:group={reconfigurable}
              value="false">No</Radio
            >
          </div>
        {/if}

        <div class="mt-6 flex gap-3">
          <p class="text-gray-600">
            Automatically distribute ETH when received?
          </p>
          <Radio
            color="primary"
            name="pushETH"
            bind:group={pushETH}
            value="true">Yes</Radio
          >
          <Radio name="pushETH" bind:group={pushETH} value="false">No</Radio>
        </div>
      </div>

      <h4 class="text-gray-600 mt-14">Splits</h4>

      <div class="flex-1 w-full bg-gray-200 h-[0.2rem] dark:bg-gray-700" />

      <div class="flex flex-wrap gap-10 justify-center mb-10">
        <Splits
          bind:doughnut
          class="my-10 flex-1 min-w-[300px]"
          formPrefix={"simple"}
          list={initialValues.simple}
        />

        <div class=" flex-1 max-w-md min-w-[300px] aspect-square">
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
  </div>
</form>

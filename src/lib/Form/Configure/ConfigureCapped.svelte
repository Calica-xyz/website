<script lang="ts">
  import ButtonGroup from "$lib/Flowbite/ButtonGroup.svelte";
  import CappedSplits from "./CappedSplits.svelte";
  import Input from "$lib/Flowbite/Input.svelte";
  import { createForm } from "felte";
  import { reporter, ValidationMessage } from "@felte/reporter-svelte";
  import { Helper } from "flowbite-svelte";
  import Radio from "$lib/Flowbite/utils/Radio.svelte";
  import {
    validateCappedSplits,
    validateContractName,
  } from "$lib/js/validators";
  import TokenDropdown from "./TokenDropdown.svelte";
  import { ethers } from "ethers";

  export let initialValues: any;
  export let onSubmit: (values: any) => void;
  export let onBack: (values: any) => void;
  export let reconfiguring = false;
  export let amountTransferred = 0;

  let name = initialValues.name;
  let reconfigurable = initialValues.reconfigurable || "false";
  let pushETH = initialValues.pushETH || "false";
  let tokenAddress = initialValues.tokenAddress || ethers.constants.AddressZero;

  const { form, data, setData } = createForm({
    extend: reporter,
    onSubmit,
    validate: (values: { name: string; capped: any }) => {
      return {
        name: validateContractName(values.name),
        capped: validateCappedSplits(values.capped),
      };
    },
  });
</script>

<form autocomplete="off" use:form>
  <div class="max-w-4xl mx-auto my-4">
    <h3 class="text-gray-600">Milestone-based Revenue Share Agreement</h3>
    <p class="subtitle-text text-gray-500 mb-8">
      Create earning milestones with different splits
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

      <div class="mt-6 flex gap-3 items-center">
        <h5 class="text-gray-600">Milestone Token</h5>
        <TokenDropdown bind:tokenAddress {setData} disabled={reconfiguring} />
      </div>

      <div class="h-10" />

      {#if !reconfiguring}
        <div class="mt-6 flex gap-3">
          <p class="text-gray-600">Can the contract be reconfigured?</p>
          <Radio
            color="primary"
            name="reconfigurable"
            bind:group={reconfigurable}
            value="true">Yes</Radio
          >
          <Radio name="reconfigurable" bind:group={reconfigurable} value="false"
            >No</Radio
          >
        </div>
      {/if}

      <div class="mt-6 flex gap-3">
        <p class="text-gray-600">Automatically distribute ETH when received?</p>
        <Radio
          color="primary"
          name="pushETH"
          bind:group={pushETH}
          value="true"
          disabled={reconfiguring}>Yes</Radio
        >
        <Radio name="pushETH" bind:group={pushETH} value="false">No</Radio>
      </div>
    </div>

    <CappedSplits
      class="mb-20"
      cappedSplits={initialValues.capped}
      formData={$data}
      formPrefix="capped"
      {amountTransferred}
    />

    <ButtonGroup
      class="mb-8 float-right"
      buttonNames={["Prev", "Next"]}
      buttonCallbacks={[() => onBack($data), () => {}]}
      buttonTypes={["button", "submit"]}
    />
  </div>
</form>

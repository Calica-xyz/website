<script lang="ts">
  import ButtonGroup from "$lib/Flowbite/ButtonGroup.svelte";
  import Input from "$lib/Flowbite/Input.svelte";
  import { ValidationMessage } from "@felte/reporter-svelte";
  import { reporter } from "@felte/reporter-svelte";
  import { createForm } from "felte";
  import { Helper } from "flowbite-svelte";
  import {
    validateContractName,
    validateExpenses,
    validateAddress,
  } from "$lib/js/validators";
  import Expenses from "./Expenses.svelte";

  export let initialValues: any;
  export let onSubmit: (values: any) => void;
  export let onBack: (values: any) => void;
  export let reconfiguring = false;

  let name = initialValues.name;
  let profitAddress = initialValues.profitAddress;

  const { form, data } = createForm({
    extend: reporter,
    onSubmit,
    validate: (values: {
      name: string;
      expense: any;
      profitAddress: string;
    }) => {
      let errorMessages = {
        name: validateContractName(values.name),
        profitAddress: validateAddress(values.profitAddress),
        expense: validateExpenses(values.expense),
      };

      return errorMessages;
    },
    transform: (values) => {
      for (let i = 0; i < values.expense.length; i++) {
        if (
          initialValues.expense &&
          initialValues.expense[i] &&
          initialValues.expense[i].amountPaid != 0
        ) {
          values.expense[i].amountPaid = initialValues.expense[i].amountPaid;
        } else {
          values.expense[i].amountPaid = 0;
        }
      }

      return {
        ...values,
      };
    },
  });
</script>

<form autocomplete="off" use:form>
  <div class="max-w-6xl mx-auto my-4">
    <h3 class="text-gray-600">Expense Submission Contract</h3>
    <p class="subtitle-text text-gray-500">
      Submit all the costs your project has incurred.
    </p>

    <div class="my-14 flex flex-col gap-6">
      <div>
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
      </div>

      <div>
        <ValidationMessage for="profitAddress" let:messages={message}>
          <div class="flex flex-wrap gap-x-6 gap-y-2 items-center">
            <h5 class="text-gray-600 pr-4">Profit Address</h5>
            <Input
              color={message != null ? "red" : "base"}
              class="max-w-[200px]"
              style="outlined"
              name="profitAddress"
              id="profitAddress"
              bind:value={profitAddress}
              disabled={reconfiguring}
            />
          </div>

          {#if message != null}
            <Helper class="absolute mb-2 sm:mb-0" color="red">{message}</Helper>
          {/if}
        </ValidationMessage>
      </div>
    </div>

    <h4 class="text-gray-600">Expenses</h4>

    <div class="flex-1 w-full bg-gray-200 h-[0.2rem] dark:bg-gray-700" />

    <Expenses
      class="my-10 max-w-[700px]"
      formPrefix={"expense"}
      list={initialValues.expense}
    />

    <ButtonGroup
      class="mb-8 float-right"
      buttonNames={["Prev", "Next"]}
      buttonCallbacks={[
        () => onBack($data),
        () => {
          console.log($data);
        },
      ]}
      buttonTypes={["button", "submit"]}
    />
  </div>
</form>

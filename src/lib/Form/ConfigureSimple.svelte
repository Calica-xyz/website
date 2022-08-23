<script lang="ts">
  import { reporter } from "@felte/reporter-svelte";
  import { createForm } from "felte";
  import { fly } from "svelte/transition";
  import ButtonGroup from "$lib/Flowbite/ButtonGroup.svelte";
  import Doughnut from "$lib/Dashboard/Doughnut.svelte";
  import Splits from "$lib/Form/Splits.svelte";
  import { signerAddress } from "svelte-ethers-store";
  import { utils } from "ethers";

  export let initialValues;
  export let pagesState;
  export let onSubmit;
  export let onBack;

  const defaultInitialValues = [
    {
      name: "Owner",
      address: $signerAddress,
      percentage: 100,
    },
    {
      name: "",
      address: "",
      percentage: "",
    },
  ];

  let currentSplits =
    "simple" in initialValues ? initialValues.simple : defaultInitialValues;

  let doughnut;
  $: doughnutData = convertFormData(currentSplits);

  function validatePercentage(percentage: number) {
    if (percentage <= 0) return "Must be > 0";

    if (!percentage) return null;

    if (percentage > 100) return "Must be <= 100";

    let percentageStr = percentage.toString();
    if (percentageStr.includes(".") && percentageStr.split(".")[1].length > 3) {
      return "Max 3 decimals";
    }

    return null;
  }

  function validateName(
    name: string,
    nameMap: object,
    address: string,
    percentage: string
  ) {
    if (!name) return percentage ? "Split needs name" : null;

    if (address && name in nameMap && nameMap[name] != address) {
      return "Name has different address";
    }

    nameMap[name] = address;

    return null;
  }

  function validateAddress(
    address: string,
    addressMap: object,
    name: string,
    percentage: string
  ) {
    if (!address) return percentage ? "Split needs address" : null;

    if (!utils.isAddress(address)) {
      return "Invalid address";
    }

    if (name && address in addressMap && addressMap[address] != name) {
      return "Address has different name";
    }

    addressMap[address] = name;

    return null;
  }

  const { form, data } = createForm({
    extend: reporter,
    onSubmit,
    validate: (values) => {
      console.log(values);
      let errorMessages = { simple: [] };
      let totalPercentages = 0;
      let nameMap = {},
        addressMap = {};

      if (values.simple) {
        for (let split of values.simple) {
          if (split.percentage) totalPercentages += split.percentage;

          errorMessages.simple.push({
            name: validateName(
              split.name,
              nameMap,
              split.address,
              split.percentage
            ),
            address: validateAddress(
              split.address,
              addressMap,
              split.name,
              split.percentage
            ),
            percentage: validatePercentage(split.percentage),
          });
        }

        if (totalPercentages != 100) {
          for (let errorMessage of errorMessages.simple) {
            if (errorMessage.percentage == null) {
              errorMessage.percentage = "Splits must sum to 100";
            }
          }
        }
      }
      return errorMessages;
    },
  });

  function convertFormData(values) {
    values = values.filter((item) => item.percentage > 0);
    return {
      labels: values.map((item) => item.name),
      splits: values.map((item) => item.percentage),
    };
  }
</script>

<form use:form>
  <div in:fly={{ x: 500, duration: 500 }} class="max-w-6xl mx-auto my-14">
    <h4 class="text-gray-600">Basic Revenue Share Agreement</h4>
    <p class="subtitle-text text-gray-500">
      Add or remove earners with their split of revenue
    </p>

    <div class="flex flex-wrap gap-10 justify-center mb-10">
      <Splits
        {doughnut}
        class="my-10 flex-1 min-w-[300px]"
        formPrefix={pagesState[0].type}
        bind:list={currentSplits}
      />

      <div class="mt-[-20px] flex-1 max-w-md min-w-[300px]">
        <Doughnut
          bind:this={doughnut}
          data={doughnutData}
          legendPosition={"top"}
        />
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

<!-- <div>{JSON.stringify($errors)}</div> -->

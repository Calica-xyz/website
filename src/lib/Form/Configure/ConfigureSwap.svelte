<script lang="ts">
  import ButtonGroup from "$lib/Flowbite/ButtonGroup.svelte";
  import Input from "$lib/Flowbite/Input.svelte";
  import Radio from "$lib/Flowbite/utils/Radio.svelte";
  import { ValidationMessage } from "@felte/reporter-svelte";
  import { reporter } from "@felte/reporter-svelte";
  import { createForm } from "felte";
  import { Helper, Tooltip } from "flowbite-svelte";
  import { chainId } from "svelte-ethers-store";
  import { validateAddress, validateContractName } from "$lib/js/validators";
  import InformationCircle from "$lib/Icons/InformationCircle.svelte";
  import TokenIcon from "$lib/Icons/TokenIcon.svelte";
  import TokenDropdown from "./TokenDropdown.svelte";
  import { ArrowRight } from "svelte-heros";
  import { getChainFromId, getTokenSymbol } from "$lib/js/utils";
  import { ethers } from "ethers";

  export let initialValues: any;
  export let onSubmit: (values: any) => void;
  export let onBack: (values: any) => void;
  export let reconfiguring = false;

  console.log(initialValues);

  let name = initialValues.name;
  let profitAddress = initialValues.profitAddress;
  let tokenAddress0 =
    "swap" in initialValues
      ? initialValues.swap["0tokenAddress"]
      : ethers.constants.AddressZero;
  let tokenAddress1 =
    "swap" in initialValues
      ? initialValues.swap["1tokenAddress"]
      : ethers.constants.AddressZero;

  let reconfigurable = initialValues.reconfigurable || "true";
  let pushETH = initialValues.pushETH || "false";

  const { form, data, setData } = createForm({
    extend: reporter,
    onSubmit,
    validate: (values: { name: string; profitAddress: string }) => {
      let errorMessages = {
        name: validateContractName(values.name),
        profitAddress: validateAddress(values.profitAddress),
      };

      return errorMessages;
    },
  });

  $: tokenSymbol0 =
    "swap" in $data
      ? getTokenSymbol($data.swap["0tokenAddress"], getChainFromId($chainId))
      : getTokenSymbol(ethers.constants.AddressZero, getChainFromId($chainId));

  $: tokenSymbol1 =
    "swap" in $data
      ? getTokenSymbol($data.swap["1tokenAddress"], getChainFromId($chainId))
      : getTokenSymbol(ethers.constants.AddressZero, getChainFromId($chainId));
</script>

<form autocomplete="off" use:form>
  <div class="max-w-6xl mx-auto my-4">
    <h3 class="text-gray-600">Token Swap Contract</h3>
    <p class="subtitle-text text-gray-500">
      Specify which token to be converted and where it should be sent
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

      <div class="py-5">
        <ValidationMessage for="profitAddress" let:messages={message}>
          <div class="flex flex-wrap gap-x-6 gap-y-2 items-center">
            <div class="flex gap-2 items-center">
              <h5 class="text-gray-600">Profit Address</h5>
              <div id="profitAddressInfo">
                <InformationCircle size="20" />
              </div>
              <Tooltip
                style="dark"
                placement="bottom"
                triggeredBy="#profitAddressInfo"
                >All converted tokens will be sent here</Tooltip
              >
            </div>

            <Input
              color={message != null ? "red" : "base"}
              class="max-w-[200px]"
              style="outlined"
              name="profitAddress"
              id="profitAddress"
              bind:value={profitAddress}
            />
          </div>

          {#if message != null}
            <Helper class="absolute mb-2 sm:mb-0" color="red">{message}</Helper>
          {/if}
        </ValidationMessage>
      </div>

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
            value="true"
            disabled={reconfiguring}>Yes</Radio
          >
          <Radio
            name="pushETH"
            bind:group={pushETH}
            value="false"
            disabled={reconfiguring}>No</Radio
          >
        </div>
      </div>

      <h4 class="text-gray-600 mt-14">Tokens</h4>

      <div class="flex-1 w-full bg-gray-200 h-[0.2rem] dark:bg-gray-700" />

      <div class="flex flex-wrap gap-10 justify-center items-center my-10">
        <div class="flex flex-col gap-4 max-w-[500px]">
          <TokenIcon token={tokenSymbol0} size="100" />
          <TokenDropdown
            tokenAddress={tokenAddress0}
            formPrefix="swap.0"
            {setData}
            disabled={false}
          />
        </div>
        <ArrowRight size="40" class="text-gray-600" />
        <div class="flex flex-col gap-4 max-w-[500px]">
          <TokenIcon token={tokenSymbol1} size="100" />
          <TokenDropdown
            tokenAddress={tokenAddress1}
            formPrefix="swap.1"
            {setData}
            disabled={false}
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
  </div>
</form>

<script lang="ts">
  import Button from "$lib/Flowbite/Button.svelte";
  import Card from "$lib/Flowbite/Card.svelte";
  import { ethers } from "ethers";
  import { createForm } from "felte";
  import { Helper, Input } from "flowbite-svelte";
  import { Plus, Trash } from "svelte-heros";
  import { page } from "$app/stores";
  import { getContractSettings } from "$lib/js/utils";
  import { onMount } from "svelte";
  import AlertMessage from "$lib/Components/AlertMessage.svelte";

  export let contractName: string;

  let message: string | null = null;
  let contractType = $page.url.searchParams.get("type");
  let showMessage: (message: string, color: string) => void;

  $: contractSettings = {
    stakeholders: [],
  };
  $: inputStakeholder = "";
  $: if (
    isValidInputStakeholder(inputStakeholder, contractSettings.stakeholders) ==
    null
  ) {
    message = null;
  }

  onMount(async () => {
    contractSettings = await getContractSettings($page.params.address);
  });

  function isValidInputStakeholder(
    stakeholder: string,
    stakeholders: string[]
  ) {
    if (stakeholder === "") {
      return "Can't be empty";
    }

    if (!ethers.utils.isAddress(stakeholder)) {
      return "Invalid address";
    }

    if (stakeholders.includes(stakeholder)) {
      return "Stakeholder already added";
    }

    return null;
  }

  async function onSubmit(values: any) {
    let res = await fetch("/api/permissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contractData: {
          name: contractName,
          address: $page.params.address,
          chain: $page.params.chain,
          type: contractType,
        },
        stakeholders: contractSettings.stakeholders,
      }),
    });

    let data = await res.json();

    if (data.success) {
      showMessage("Settings were saved successfully.", "green");
    } else {
      showMessage("Something went wrong. Settings weren't saved.", "red");
    }
  }

  const { form } = createForm({ onSubmit });
</script>

<AlertMessage bind:showMessage />

<form class="h-full m-2 sm:m-8" use:form>
  <div class="m-auto flex flex-col justify-between max-w-[800px]">
    <div class="flex justify-start gap-y-10 gap-x-20 flex-wrap">
      <div class="flex-1 max-w-[245px]">
        <h3>Stakeholders</h3>
        <p class="subtitle-text">Share dashboard access with others</p>
      </div>

      <Card
        class="pb-0 flex-1 min-w-[min(100%,300px)] max-w-[490px] max-h-[295px]"
      >
        <div class="flex">
          <div class="flex-grow">
            <Input
              color={message != null ? "red" : "base"}
              placeholder="Address"
              class="bg-white"
              style="outlined"
              name="stakeholders"
              id="stakeholders"
              bind:value={inputStakeholder}
            />
            {#if message != null}
              <Helper class="absolute mb-2 sm:mb-0" color="red"
                >{message}</Helper
              >
            {/if}
          </div>
          <span class="ml-3">
            <button
              on:click={() => {
                message = isValidInputStakeholder(
                  inputStakeholder,
                  contractSettings.stakeholders
                );
                if (message != null) return;
                contractSettings.stakeholders = [
                  inputStakeholder,
                  ...contractSettings.stakeholders,
                ];
                inputStakeholder = "";
              }}
              type="button"
              class="inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <Plus size="20" />
            </button>
          </span>
        </div>
        <div class="mt-6 overflow-y-auto">
          <ul class="divide-y divide-gray-200">
            {#each contractSettings.stakeholders as stakeholder, i}
              <li
                class={(i == 0 ? "pb-3" : "py-3") + " flex gap-1 items-center"}
              >
                <div
                  class="flex-1 whitespace-nowrap overflow-hidden ml-3 flex flex-col"
                >
                  <p
                    class="whitespace-nowrap overflow-hidden text-ellipsis text-sm font-medium text-gray-900"
                  >
                    {stakeholder}
                  </p>
                </div>

                <button
                  type="button"
                  on:click={() => {
                    contractSettings.stakeholders = [
                      ...contractSettings.stakeholders.slice(0, i),
                      ...contractSettings.stakeholders.slice(i + 1),
                    ];
                  }}
                  class="p-2 hover:bg-gray-100 rounded-md"
                >
                  <Trash size="14" />
                </button>
              </li>
            {/each}
          </ul>
        </div>
      </Card>
    </div>

    <div class="flex justify-end">
      <Button type="submit" class="mt-[40vmin] w-[170px]"
        ><p>Save Changes</p></Button
      >
    </div>
  </div>
</form>

<script lang="ts">
  import { ValidationMessage } from "@felte/reporter-svelte";
  import { Helper } from "flowbite-svelte";
  import { signerAddress, chainId } from "svelte-ethers-store";
  import Splits from "./Splits.svelte";
  import Doughnut from "$lib/Dashboard/Doughnut.svelte";
  import Button from "$lib/Flowbite/Button.svelte";
  import Input from "$lib/Flowbite/Input.svelte";
  import Eth from "$lib/CustomIcons/Eth.svelte";
  import Polygon from "$lib/CustomIcons/Polygon.svelte";
  import { getIconName } from "$lib/js/utils";

  export let formPrefix: string = "";
  export let cappedSplits: any = [
    {
      cap: 0,
      splits: [
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
      ],
    },
  ];

  let doughnuts = [];
  $: chainIconName = getIconName($chainId);

  function addCappedSplit() {
    let prevCappedSplits = cappedSplits[cappedSplits.length - 1];

    cappedSplits = [
      ...cappedSplits,
      {
        cap: null,
        splits: JSON.parse(JSON.stringify(prevCappedSplits.splits)),
      },
    ];
  }

  function deleteCappedSplit(i) {
    cappedSplits = [...cappedSplits.slice(0, i), ...cappedSplits.slice(i + 1)];
  }
</script>

<div class={`${$$props.class} flex flex-col`}>
  {#each cappedSplits as cappedSplit, i (`${formPrefix}.${i}.cap`)}
    <div class="my-12 sm:my-4 w-full">
      <div class="mb-6 flex gap-x-4 items-center justify-between">
        {#if i == 0}
          <h3 class="text-gray-600">Initial Split</h3>
        {:else}
          <div class="flex flex-wrap items-center gap-x-4">
            <h3 class="text-gray-600">Milestone {i}</h3>
            <ValidationMessage
              for={`${formPrefix}.${i}.cap`}
              let:messages={message}
            >
              <div class="max-w-[125px]">
                <div class="flex">
                  <Input
                    class="z-10 flex-1 rounded-lg rounded-r-none"
                    color={message != null ? "red" : "base"}
                    style="outlined"
                    name={`${formPrefix}.${i}.cap`}
                    id={`${formPrefix}.${i}.cap`}
                    type="number"
                    bind:value={cappedSplit.cap}
                  />
                  <div
                    class="h-11 border border-l-0 w-9 grid place-items-center rounded-lg rounded-l-none"
                  >
                    {#if chainIconName == "Polygon"}
                      <Polygon size="18" />
                    {:else if chainIconName == "Eth"}
                      <Eth size="18" />
                    {/if}
                  </div>
                </div>

                {#if message != null}
                  <Helper color="red">{message}</Helper>
                {/if}
              </div>
            </ValidationMessage>
          </div>
          <Button
            class="h-10"
            outline
            color="accent"
            on:click={() => deleteCappedSplit(i)}
          >
            Remove
          </Button>
        {/if}
      </div>

      <div class="flex-1 w-full bg-gray-200 h-[0.2rem] dark:bg-gray-700" />

      <div class="py-4 flex flex-wrap gap-x-10 gap-y-4 justify-center">
        <Splits
          id={`${formPrefix}.${i}.cap`}
          bind:doughnut={doughnuts[i]}
          class="my-10 flex-1 min-w-[min(300px,100%)]"
          formPrefix={`${formPrefix}.${i}.splits`}
          bind:list={cappedSplit.splits}
        />

        <Doughnut
          class="flex-1 max-w-[350px] min-w-[230px] aspect-square"
          bind:this={doughnuts[i]}
          legendPosition={"top"}
        />
      </div>
    </div>
  {/each}

  <Button
    color="primary"
    on:click={addCappedSplit}
    outline={true}
    class="mt-8 focus:ring-0 border-dashed w-full">Add Milestone</Button
  >
</div>

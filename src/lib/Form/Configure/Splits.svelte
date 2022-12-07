<script lang="ts">
  import Button from "$lib/Flowbite/Button.svelte";
  import Split from "./Split.svelte";
  import { fade } from "svelte/transition";
  import { X, Plus } from "svelte-heros";
  import { signerAddress } from "svelte-ethers-store";

  export let list: any[] = [
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
  export let formPrefix = "";
  export let doughnut: any = null;
  export let disabled = false;

  let initializedDoughnut = false;

  $: if (doughnut && !initializedDoughnut) {
    doughnut.updateData(convertFormData(list));
    doughnut.redrawChart(10);
    initializedDoughnut = true;
  }

  function convertFormData(values: any[]) {
    values = values.filter((item) => item.percentage > 0);
    return {
      labels: values.map((item) => item.name),
      splits: values.map((item) => item.percentage),
    };
  }

  function updateListItem(index: number, key: string, value: any) {
    if (doughnut) {
      if (key == "percentage" || (key == "name" && list[index].percentage)) {
        doughnut.updateData(convertFormData(list));
        doughnut.redrawChart(10);
      }
    }
  }

  function add() {
    list = [
      ...list,
      {
        name: "",
        address: "",
        percentage: "",
      },
    ];
  }

  function remove(i: number) {
    if (doughnut && list[i].percentage) {
      doughnut.updateData(convertFormData(list));
      doughnut.redrawChart(10);
    }

    list = [...list.slice(0, i), ...list.slice(i + 1)];
  }
</script>

<div class={`${$$props.class} flex flex-col gap-y-10 sm:gap-y-4`}>
  {#each list as item, i (`${formPrefix}.${i}.`)}
    <div in:fade class="flex gap-x-5 items-center">
      <Split
        id={`${formPrefix}.${i}.`}
        class="flex-1"
        listIndex={i}
        formPrefix={`${formPrefix}.${i}.`}
        inputCallback={updateListItem}
        {disabled}
        bind:name={item.name}
        bind:address={item.address}
        bind:percentage={item.percentage}
      />
      <Button
        on:click={() => remove(i)}
        {disabled}
        color="accent"
        outline={true}
        class="!p-2 h-10"><X size="20" /></Button
      >
    </div>
  {/each}

  <Button
    color="primary"
    on:click={add}
    {disabled}
    outline={true}
    class="focus:ring-0 border-dashed w-full"><Plus size="20" /></Button
  >
</div>

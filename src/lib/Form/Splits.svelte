<script lang="ts">
  import Button from "$lib/Flowbite/Button.svelte";
  import { fade, fly } from "svelte/transition";
  import { flip } from "svelte/animate";

  import Split from "./Split.svelte";
  import { X, Plus } from "svelte-heros";

  export let list: any[] = [];
  export let formPrefix: string = "";
  export let doughnut = null;

  function updateListItem(index: number, key: string, value: any) {
    list[index][key] = value;
    if (doughnut) {
      if (key == "percentage" || (key == "name" && list[index].percentage)) {
        doughnut.instantlyRedrawChart();
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

  function remove(i) {
    if (doughnut && list[i].percentage) {
      doughnut.instantlyRedrawChart();
    }

    list = [...list.slice(0, i), ...list.slice(i + 1)];
  }
</script>

<div class={`${$$props.class} flex flex-col gap-y-10 sm:gap-y-4`}>
  {#each list as item, i (item)}
    <div animate:flip in:fade class="flex gap-x-5">
      <Split
        class="flex-1"
        listIndex={i}
        formPrefix={`${formPrefix}.${i}.`}
        inputCallback={updateListItem}
        name={item.name}
        address={item.address}
        percentage={item.percentage}
      />
      <Button
        on:click={() => remove(i)}
        color="secondary"
        outline={true}
        class="!p-2 sm:h-10"><X size="20" /></Button
      >
    </div>
  {/each}

  <Button
    color="primary"
    on:click={add}
    outline={true}
    class="focus:ring-0 border-dashed w-full"><Plus size="20" /></Button
  >
</div>

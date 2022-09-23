<script lang="ts">
  import CopyButton from "$lib/Components/CopyButton.svelte";
  import Card from "$lib/Flowbite/Card.svelte";
  import List from "$lib/Flowbite/List.svelte";
  import { UserCircle } from "svelte-heros";
  import { signerAddress } from "svelte-ethers-store";

  // TODO: Define type
  export let data: any;
</script>

<Card class={$$props.class}>
  <div class="flex justify-between items-center mb-4">
    <h5 class="dark:text-white">Recipients</h5>
  </div>
  <List
    items={data}
    let:item
    class="dark:!bg-transparent max-h-[75px] overflow-y-auto"
    border="border-0"
  >
    <div class="flex flex-wrap gap-x-8 justify-between">
      <div class="flex">
        <p class="subtitle-text max-w-[136px] truncate text-ellipsis">
          {item.name}
        </p>
        {#if item.address == $signerAddress}
          <UserCircle size="18" class="text-gray-400 ml-1" />
        {/if}
      </div>

      <CopyButton class="max-w-[100px] sm:max-w-[150px]" text={item.address} />
    </div>
  </List>
</Card>

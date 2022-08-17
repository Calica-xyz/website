<script>
  import Modal from "$lib/Flowbite/Modal.svelte";
  import CopyButton from "$lib/Components/CopyButton.svelte";
  import Card from "$lib/Flowbite/Card.svelte";
  import List from "$lib/Flowbite/List.svelte";

  export let data;
  export let isOwner;

  let className = "";
  export { className as class };

  let modal = false;
  let truncatedData = data.slice(0, 2);
</script>

<Card class={className}>
  <div class="flex justify-between items-center mb-4">
    <h5 class="dark:text-white">Stakeholders</h5>

    {#if isOwner}
      <p
        on:click={() => (modal = true)}
        class="cursor-pointer text-sm font-medium text-primary hover:underline dark:text-primary    "
      >
        View all
      </p>
    {/if}
  </div>
  <List
    items={truncatedData}
    let:item
    class="dark:!bg-transparent"
    border="border-0"
  >
    <div class="flex gap-x-8 justify-between">
      <div class="flex flex-wrap items-center dark:text-white gap-x-2">
        <p class="subtitle-text max-w-[136px] truncate text-ellipsis">
          {item.name}
        </p>

        <CopyButton class="max-w-[110px]" text={item.address} />
      </div>
      <div class="inline-flex items-center dark:text-white">
        {item.amountPaid}
      </div>
    </div>
  </List>
</Card>

<Modal title="Stakeholders" bind:open={modal}>
  <List items={data} border={"border-0"} let:item class="dark:!bg-transparent">
    <div class="my-2 flex gap-x-8 justify-between">
      <div
        class="flex-auto flex flex-wrap items-center dark:text-white gap-x-2"
      >
        <p class="subtitle-text max-w-[190px] truncate text-ellipsis">
          {item.name}
        </p>

        <CopyButton class="max-w-[110px]" text={item.address} />
      </div>
      <div class="inline-flex items-center dark:text-white">
        {item.amountPaid}
      </div>
    </div>
  </List>
</Modal>

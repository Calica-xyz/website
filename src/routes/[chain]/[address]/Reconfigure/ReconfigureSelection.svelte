<script lang="ts">
  import Button from "$lib/Flowbite/Button.svelte";

  export let onSubmit: (values: any) => void;
</script>

<!-- TODO: Update the copy here for expense submission -->
<div class="m-8 flex flex-col gap-10">
  <div class="flex flex-col gap-2">
    <h2 class="text-gray-600">This contract can be reconfigured</h2>
    <p>
      All past splits are unaffected. Only future funds will be affected by a
      new configuration.
    </p>
  </div>

  <Button class="max-w-[140px]" on:click={onSubmit}>Configure</Button>
</div>

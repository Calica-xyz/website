<script lang="ts">
  import FloatingLabelInput from "$lib/Flowbite/FloatingLabelInput.svelte";
  import { ValidationMessage } from "@felte/reporter-svelte";
  import { Helper } from "flowbite-svelte";

  export let listIndex: number = 0;
  export let inputCallback;
  export let formPrefix: string = "";
  export let name: string = "";
  export let address: string = "";
  export let percentage: string = "";
</script>

<div class={`${$$props.class} flex max-w-sm sm:max-w-xl flex-wrap`}>
  <div class="flex-1">
    <ValidationMessage for={`${formPrefix}name`} let:messages={message}>
      <FloatingLabelInput
        color={message != null ? "red" : "base"}
        class="rounded-r-none rounded-b-none sm:rounded-b-lg sm:rounded-r-none"
        style="outlined"
        id={`${formPrefix}name`}
        name={`${formPrefix}name`}
        type="text"
        label="Name"
        size="small"
        bind:value={name}
        on:change={() => inputCallback(listIndex, "name", name)}
      />
      {#if message != null}
        <Helper class="mb-2 sm:mb-0" color="red">{message}</Helper>
      {/if}
    </ValidationMessage>
  </div>

  <div class="flex max-w-[120px] flex-1 order-2">
    <div>
      <ValidationMessage for={`${formPrefix}percentage`} let:messages={message}>
        <FloatingLabelInput
          color={message != null ? "red" : "base"}
          class="rounded-none"
          style="outlined"
          id={`${formPrefix}percentage`}
          name={`${formPrefix}percentage`}
          type="number"
          label="Split"
          size="small"
          bind:value={percentage}
          on:change={() => inputCallback(listIndex, "percentage", percentage)}
        />
        {#if message != null}
          <Helper
            class="mb-2 sm:mb-0"
            style="width: calc(100% + 30px);"
            color="red">{message}</Helper
          >
        {/if}
      </ValidationMessage>
    </div>

    <div
      class="h-10 min-w-[30px] bg-gray-100 w-8 border grid place-items-center rounded-lg rounded-l-none rounded-b-none sm:rounded-r-lg"
    >
      <p class="text-black">%</p>
    </div>
  </div>

  <div class="sm:flex-1 w-full sm:w-auto order-3 sm:order-1">
    <ValidationMessage for={`${formPrefix}address`} let:messages={message}>
      <FloatingLabelInput
        color={message != null ? "red" : "base"}
        class="min-w-sm rounded-t-none sm:rounded-none"
        style="outlined"
        id={`${formPrefix}address`}
        name={`${formPrefix}address`}
        type="text"
        label="Address"
        size="small"
        bind:value={address}
        on:change={() => inputCallback(listIndex, "address", address)}
      />
      {#if message != null}
        <Helper class="mb-2 sm:mb-0" color="red">{message}</Helper>
      {/if}
    </ValidationMessage>
  </div>
</div>

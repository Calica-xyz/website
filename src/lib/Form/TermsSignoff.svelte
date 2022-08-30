<script lang="ts">
  import { ValidationMessage } from "@felte/reporter-svelte";

  import { List, Alert } from "flowbite-svelte";
  import Checkbox from "$lib/Flowbite/Checkbox.svelte";
  import { MinusSm } from "svelte-heros";
  import { fade } from "svelte/transition";
</script>

<List
  class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white shadow"
>
  <div class="px-4 py-5 sm:px-6">
    <h5 class="leading-6 text-gray-600">Terms and Conditions</h5>
  </div>

  <div class="px-4 py-5 sm:px-6 ml-2">
    <ul class="text-xs text-gray-500">
      <li class="flex gap-2">
        <MinusSm size="15" /> Calica contracts are gas-optimized and have 100% test
        coverage.
      </li>
      <li class="flex gap-2">
        <MinusSm size="15" />
        Once deployed, your contract can't be modified by anyone.
      </li>
      <li class="flex gap-2">
        <MinusSm size="15" />
        Calica is not responsible for any financial losses for any reason.
      </li>
    </ul>
  </div>

  <div class="px-4 py-5 sm:px-6 flex flex-wrap gap-4">
    <Checkbox name="terms" class="min-w-[150px]" color="primary"
      >I agree with the terms and conditions above</Checkbox
    >
    <ValidationMessage for="terms" let:messages={message}>
      {#if message}
        <div in:fade>
          <Alert class="p-2 mb-0 w-[236px]" color="red">{message}</Alert>
        </div>
      {/if}
    </ValidationMessage>
  </div>
</List>

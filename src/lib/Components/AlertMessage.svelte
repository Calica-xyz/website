<script lang="ts">
  import { Alert } from "flowbite-svelte";
  import { fade } from "svelte/transition";

  type color =
    | "gray"
    | "blue"
    | "red"
    | "green"
    | "yellow"
    | "indigo"
    | "purple"
    | "pink"
    | "dark"
    | "custom"
    | undefined;

  $: shown = false;
  let shownMessage = "";
  let shownColor: color;

  export function showMessage(message: string, color: color) {
    shown = true;
    shownMessage = message;
    shownColor = color;
  }
</script>

{#if shown}
  <div in:fade={{ duration: 300 }}>
    <Alert
      class="fixed top-20 right-10 w-[260px]"
      color={shownColor}
      dismissable
      on:handleAlert={() => {
        shown = false;
      }}
    >
      {shownMessage}
    </Alert>
  </div>
{/if}

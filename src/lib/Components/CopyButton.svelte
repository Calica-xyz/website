<script lang="ts">
  import { Button, Tooltip } from "flowbite-svelte";
  import { Clipboard } from "svelte-heros";
  import { fade } from "svelte/transition";

  export let text: string;

  function copyText() {
    navigator.clipboard.writeText(text);
  }
</script>

<Button
  id="copy-button"
  on:click={copyText}
  class={`px-1 ${$$props.class}`}
  color="alternative"
  size="xs"
  pill={true}
  style="padding-top: 0; padding-bottom: 0;"
>
  <div class="flex whitespace-nowrap overflow-hidden">
    <span
      class="subtitle-text text-gray-400 flex-1 whitespace-nowrap overflow-hidden text-ellipsis"
      >{text}</span
    >
    <Clipboard class="text-gray-400 ml-1 flex-[0_0_auto]" size="15" />
  </div>
</Button>
<Tooltip style="dark" trigger="click" triggeredBy="#copy-button"
  ><div in:fade={{ duration: 200 }}>Copied!</div></Tooltip
>

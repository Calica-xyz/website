<script>
    import { Button, Tooltip } from "flowbite-svelte";
    import { Clipboard } from "svelte-heros";

    export let text;

    function copyText() {
        navigator.clipboard.writeText(text);
    }
</script>

<Tooltip content="Copied" trigger="click">
    <Button
        on:click={copyText}
        class="max-w-[110px] px-1"
        color="alternative"
        size="xs"
        pill={true}
        style="padding-top: 0; padding-bottom: 0;"
    >
        <div class="flex whitespace-nowrap overflow-hidden">
            <span
                class="subtitle-text flex-1 whitespace-nowrap overflow-hidden text-ellipsis"
                >{text}</span
            >
            <Clipboard class="flex-[0_0_auto]" size="17" />
        </div>
    </Button>
</Tooltip>

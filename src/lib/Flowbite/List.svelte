<script lang="ts">
    import { setContext } from "svelte";
    import classNames from "classnames";

    import ListItem from "$lib/Flowbite/ListItem.svelte";

    export let items: ListGroupItemType[] = [];
    export let active: boolean = false;
    export let border: string = "border";

    interface ListGroupItemType {
        current?: boolean;
        disabled?: boolean;
        href?: string;
        [propName: string]: any;
    }

    setContext("background", true);
    $: setContext("active", active);

    let groupClass: string;
    $: groupClass = classNames(
        "text-gray-900 bg-white dark:text-gray-200 dark:bg-gray-700",
        `rounded-lg ${border} border-gray-200 dark:border-gray-600`,
        "divide-y divide-gray-200 dark:divide-gray-600",
        $$props.class
    );
</script>

<svelte:element this={active ? "div" : "ul"} class={groupClass}>
    {#each items as item, index}
        <ListItem {active} {...item} {index} on:click
            ><slot {item} {index} /></ListItem
        >
    {:else}
        <slot />
    {/each}
</svelte:element>

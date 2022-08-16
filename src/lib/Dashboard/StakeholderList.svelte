<script>
    import { List, Card } from "flowbite-svelte";
    import CopyButton from "$lib/Components/CopyButton.svelte";

    export let data;
    export let primaryColor;

    let className;
    export { className as class };

    let truncatedData = data.slice(0, 2);
</script>

<Card class="max-w-xl {className} ">
    <div class="flex justify-between items-center mb-4">
        <h5 class="dark:text-white">Stakeholders</h5>

        <!-- TODO: Make this a modal for all data -->
        <a
            href="#"
            class="text-sm font-medium text-[#46BFBD] hover:underline dark:text-blue-500"
        >
            View all
        </a>
    </div>
    <List items={truncatedData} let:item class="border-0 dark:!bg-transparent">
        <div class="flex gap-x-8 justify-between">
            <div class="flex items-center dark:text-white gap-x-2">
                <p class="subtitle-text max-w-[150px] ">{item.name}</p>
                <CopyButton text={item.address} />
            </div>
            <div class="inline-flex items-center dark:text-white">
                {item.amountPaid}
            </div>
        </div>
    </List>
</Card>

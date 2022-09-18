<script lang="ts">
  import Card from "$lib/Flowbite/Card.svelte";
  import Doughnut from "$lib/Components/Doughnut.svelte";
  import {
    TabWrapper,
    TabHead,
    TabHeadItem,
    TabContentItem,
  } from "flowbite-svelte";

  export let data: any;
  export let isOwner: boolean;

  let customActiveTabClasses =
    "inline-block py-4 px-4 text-sm font-medium text-center text-primary-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-primary-500";
  let customInactiveTabClasses =
    "inline-block py-4 px-4 text-sm font-medium text-center text-gray-500 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300";

  let activeTabValue = 1;
  const handleClick = (tabValue: number) => () => {
    activeTabValue = tabValue;
  };

  $: title = isOwner ? "Revenue Share" : "Your Share";
</script>

<Card class={`${$$props.class} min-w-[min(300px,100%)]`}>
  <h4 class="mb-3">{title}</h4>
  <div class="flex-1 flex">
    <TabWrapper class="mb-4" bind:activeTabValue let:tabStyle let:tabId>
      <TabHead {tabStyle} {tabId}>
        <TabHeadItem
          id={1}
          tabStyle="custom"
          {activeTabValue}
          customActiveClass={customActiveTabClasses}
          customInActiveClass={customInactiveTabClasses}
          on:click={handleClick(1)}>Primary</TabHeadItem
        >
        <TabHeadItem
          id={2}
          tabStyle="custom"
          {activeTabValue}
          customActiveClass={customActiveTabClasses}
          customInActiveClass={customInactiveTabClasses}
          on:click={handleClick(2)}>Secondary</TabHeadItem
        >
      </TabHead>
      <TabContentItem contentDivClass="bg-none" id={1} {activeTabValue}>
        <Doughnut class="max-w-[400px] w-full m-auto" data={data.primary} />
      </TabContentItem>
      <TabContentItem contentDivClass="bg-none" id={2} {activeTabValue}>
        <Doughnut class="max-w-[400px] w-full m-auto" data={data.secondary} />
      </TabContentItem>
    </TabWrapper>
  </div>
</Card>

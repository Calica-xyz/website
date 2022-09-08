<script lang="ts">
  import Card from "$lib/Flowbite/Card.svelte";
  import Doughnut from "$lib/Dashboard/Doughnut.svelte";
  import {
    TabWrapper,
    TabHead,
    TabHeadItem,
    TabContentItem,
  } from "flowbite-svelte";

  export let data: any;
  export let isOwner: boolean;

  let activeTabValue = 1;
  const handleClick = (tabValue) => () => {
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
          {tabStyle}
          {activeTabValue}
          on:click={handleClick(1)}>Primary</TabHeadItem
        >
        <TabHeadItem
          id={2}
          {tabStyle}
          {activeTabValue}
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

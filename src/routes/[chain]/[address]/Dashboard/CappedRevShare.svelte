<script lang="ts">
  import Card from "$lib/Flowbite/Card.svelte";
  import Badge from "$lib/Flowbite/Badge.svelte";
  import Doughnut from "$lib/Components/Doughnut.svelte";
  import {
    getBadgeColor,
    getChainFromId,
    getCurrency,
    getTokenSymbol,
  } from "$lib/js/utils";
  import { chainId } from "svelte-ethers-store";

  export let data: any;
  export let chain: string;
  export let tokenAddress: string;

  let charts: any[] = [];
  let capColor = getBadgeColor(chain);

  $: legendItems = getLegendItems(charts);

  // Aggregates all the legend labels for every capped split
  function getLegendItems(charts: any[]) {
    let retLegendItems: any[] = [];

    for (let i = 0; i < charts.length; i++) {
      let currentChart = charts[i];
      let currentItems = currentChart.legend
        ? currentChart.legend.legendItems
        : [];

      for (let i = 0; i < currentItems.length; i++) {
        if (
          !retLegendItems.some(
            (existingItem) => existingItem.label == currentItems[i].text
          )
        ) {
          retLegendItems.push({
            label: currentItems[i].text,
            color: currentItems[i].fillStyle,
          });
        }
      }
    }

    return retLegendItems;
  }

  function getMinWidth() {
    let minWidth = data.length * 350;
    return `min-width: min(${minWidth}px, 100%);`;
  }
</script>

<div class={$$props.class} style={getMinWidth()}>
  <Card class="h-full">
    <h4 class="mb-3">Agreement</h4>
    <div class="legend mb-10 flex flex-wrap gap-x-3 gap-y-3 justify-center">
      {#each legendItems as legendItem}
        <div class="flex items-center gap-1.5">
          <div class="w-9 h-2.5" style="background-color: {legendItem.color}" />
          <p class="subtitle-text">{legendItem.label}</p>
        </div>
      {/each}
    </div>
    <div class="items-center flex flex-wrap  sm:gap-y-6">
      {#each data as cappedSplit, i}
        <div class="flex-1 mb-6 sm:mb-0">
          <div class="flex items-center">
            <div
              class="flex z-10 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0"
            >
              {#if i == 0}
                <Badge class="text-center" color={capColor}>Initial Split</Badge
                >
              {:else}
                <Badge class="text-center" color={capColor}
                  >{cappedSplit.cap}
                  {getTokenSymbol(
                    tokenAddress,
                    getChainFromId($chainId)
                  )}</Badge
                >
              {/if}
            </div>
            <div class="flex w-full bg-gray-200 h-[3px] dark:bg-gray-700" />
          </div>
          <div class="m-auto mt-3 max-w-sm min-w-[100px] px-2 sm:pr-5 sm:pl-11">
            <Doughnut
              bind:currentChart={charts[i]}
              displayLegend={false}
              data={cappedSplit.splits}
            />
          </div>
        </div>
      {/each}
    </div>
  </Card>
</div>

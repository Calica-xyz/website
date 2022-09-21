<script lang="ts">
  import { Chart, registerables } from "chart.js";
  import { onMount } from "svelte";
  import { getHexCode } from "$lib/js/utils";
  import type { _DeepPartialObject } from "chart.js/types/utils";

  Chart.register(...registerables);

  export let data: any = {
    labels: [],
    splits: [],
  };
  export let displayLegend = true;
  export let legendPosition:
    | "bottom"
    | "center"
    | "top"
    | "right"
    | "left"
    | "chartArea"
    | _DeepPartialObject<{
        [scaleId: string]: number;
      }> = "bottom";
  export let currentChart: Chart<"doughnut", any, unknown> | null = null;

  $: onChange(data);

  function onChange(data: any) {
    redrawChart(10);
  }

  export async function redrawChart(delay: number) {
    if (currentChart) currentChart.destroy();
    setTimeout(function () {
      try {
        drawChart();
      } catch (err) {
        // Chart.js bug that throws an an ugly exception in console
      }
    }, delay);
  }

  export async function updateData(newData: any) {
    data = newData;
  }

  let canvas: HTMLCanvasElement;

  const doughnutColors = [
    getHexCode("--color-secondary"),
    getHexCode("--color-accent"),
    getHexCode("--color-tertiary"),
    getHexCode("--color-primary"),
    getHexCode("--color-quaternary"),
    getHexCode("--color-quinary"),
  ];

  $: chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.splits,
        backgroundColor: getBackgroundColors(),
        hoverOffset: 4,
        radius: "98%", // Leaving a little room for hover effect
      },
    ],
  };

  function getBackgroundColors() {
    let colorInd = 0;
    let backgroundColors = [];

    for (let i = 0; i < data.labels.length; i++) {
      if (!data.labels[i]) {
        backgroundColors.push("#E5E4E2"); // Gray color for empty labels
      } else {
        backgroundColors.push(doughnutColors[colorInd]);
        colorInd = (colorInd + 1) % doughnutColors.length;
      }
    }

    return backgroundColors;
  }

  function drawChart() {
    currentChart = new Chart(canvas, {
      type: "doughnut",
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: displayLegend,
            position: legendPosition,
            labels: {
              filter: function (item, _) {
                return item.text && item.text.length > 0;
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (item) => `${item.label}: ${item.raw}%`,
            },
            filter: function (tooltipItem, _) {
              return tooltipItem.label && tooltipItem.label.length > 0;
            },
          },
        },
      },
    });
  }

  onMount(() => {
    drawChart();
  });
</script>

<div class={$$props.class}>
  <canvas style="width: 210px; height: 210px;" bind:this={canvas} />
</div>

<!-- TODO: This triggers on mobile when the user scrolls the page. Need to fix this. -->
<svelte:window
  on:resize={() => {
    redrawChart(500);
  }}
/>

<script lang="ts">
  import { Chart, registerables } from "chart.js";
  import { onMount } from "svelte";
  import { getHexCode } from "$lib/js/utils";

  Chart.register(...registerables);

  export let data: any = {
    labels: [],
    splits: [],
  };
  export let displayLegend: boolean = true;
  export let legendPosition: string = "bottom";

  let canvas: HTMLCanvasElement;
  export let currentChart = null;

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

  export async function redrawChart() {
    currentChart.destroy();
    setTimeout(function () {
      try {
        drawChart();
      } catch (err) {
        // Chart.js bug that throws an an ugly exception in console
      }
    }, 500);
  }

  export async function instantlyRedrawChart() {
    currentChart.destroy();
    setTimeout(function () {
      try {
        drawChart();
      } catch (err) {
        // Chart.js bug that throws an an ugly exception in console
      }
    }, 10);
  }

  export async function updateData(newData) {
    data = newData;
  }

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
              filter: function (item) {
                return item.text && item.text.length > 0;
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (item) => `${item.label}: ${item.raw}%`,
            },
            filter: function (tooltipItem) {
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

<svelte:window on:resize|passive={redrawChart} />

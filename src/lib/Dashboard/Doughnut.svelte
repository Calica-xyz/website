<script lang="ts">
  import { Chart, registerables } from "chart.js";
  import { onMount } from "svelte";
  import { getRGB } from "$lib/js/utils";

  Chart.register(...registerables);

  export let data: any;
  export let displayLegend: boolean = true;
  export let legendPosition: string = "bottom";

  let canvas: HTMLCanvasElement;
  export let currentChart: Chart = null;

  $: chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.splits,
        backgroundColor: [
          getRGB("--color-primary"),
          getRGB("--color-secondary"),
          getRGB("--color-tertiary"),
          getRGB("--color-accent"),
        ],
        hoverOffset: 4,
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
          },
          tooltip: {
            callbacks: {
              label: (item) => `${item.label}: ${item.raw}%`,
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

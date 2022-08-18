<script lang="ts">
  import { Chart, registerables } from "chart.js";
  import { onMount } from "svelte";
  import { getRGB } from "$lib/js/utils";

  Chart.register(...registerables);

  export let data;

  let canvas: HTMLCanvasElement;
  let currentChart: Chart;

  let chartData = {
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

  function redrawChart() {
    currentChart.destroy();
    drawChart();
  }

  function drawChart() {
    currentChart = new Chart(canvas, {
      type: "doughnut",
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
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

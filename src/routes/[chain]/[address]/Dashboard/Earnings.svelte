<script lang="ts">
  import { Chart, registerables } from "chart.js";
  import { onMount } from "svelte";
  import Card from "$lib/Flowbite/Card.svelte";
  import { fromUnixTime } from "date-fns";
  import { getHexCode, hexToRgbA } from "$lib/js/utils";
  import "chartjs-adapter-date-fns";

  Chart.register(...registerables);

  export let data: any;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let formattedData;
  let currentChart: Chart;

  let labelColors = [
    getHexCode("--color-primary"),
    getHexCode("--color-tertiary"),
    getHexCode("--color-secondary"),
    getHexCode("--color-quaternary"),
    getHexCode("--color-quinary"),
    getHexCode("--color-senary"),
    getHexCode("--color-septenary"),
    getHexCode("--color-octonary"),
  ];

  $: onChange(data);
  function onChange(data: any) {
    redrawChart(10);
  }

  function formatData() {
    let formattedData = JSON.parse(JSON.stringify(data));
    let labelColorInd = 0;

    for (let dataset of formattedData.datasets) {
      let color = labelColors[labelColorInd++ % labelColors.length];
      let gradientColor,
        fill = false;

      if (formattedData.datasets.length == 1) {
        fill = true;
        gradientColor = ctx.createLinearGradient(
          0,
          0,
          0,
          canvas.getBoundingClientRect().width * 0.8
        );
        gradientColor.addColorStop(0, hexToRgbA(color, 0.3));
        gradientColor.addColorStop(1, hexToRgbA(color, 0));
      }

      dataset["backgroundColor"] = gradientColor || color;
      dataset["borderColor"] = color;
      dataset["hoverBorderColor"] = color;
      dataset["hoverBorderWidth"] = 7;
      dataset["fill"] = fill;
      dataset["propagate"] = true;
      dataset["tension"] = 0.1;
      dataset["pointBorderWidth"] = 5;

      for (let i = 0; i < dataset.data.length; i++) {
        dataset.data[i].x = fromUnixTime(dataset.data[i].x);
      }
    }

    return formattedData;
  }

  function redrawChart(delay: number) {
    if (currentChart) currentChart.destroy();
    setTimeout(function () {
      try {
        drawChart();
      } catch (err) {
        // Chart.js bug that throws an an ugly exception in console
      }
    }, delay);
  }

  function drawChart() {
    formattedData = formatData();

    currentChart = new Chart(canvas, {
      type: "line",
      options: {
        aspectRatio: 1,
        responsive: true,
        plugins: {
          legend: {
            display: data.datasets.length > 1,
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                let value = context.parsed.y;
                return " " + label + ": " + value;
              },
            },
          },
        },
        scales: {
          x: {
            padding: 10,
            offset: true,
            grid: {
              display: false,
              drawBorder: false,
            },
            type: "time",
            time: {
              minUnit: "second",
            },
          },
          y: {
            startAtZero: true,
            drawBorder: false,
            offset: true,
          },
        },
      },
      data: formattedData,
    });
  }

  onMount(() => {
    ctx = canvas.getContext("2d");
    drawChart();
  });
</script>

<div class={`${$$props.class}`} style="min-width: min(350px, 100%);">
  <Card class="h-full">
    <h4 class="mb-3">Total Paid</h4>
    <div
      class="flex-1 flex items-center justify-center"
      style="min-width: min(350px, 100%);"
    >
      <canvas
        class="max-w-[400px] max-h-[400px]"
        style="width: 100%; height: 100%;"
        bind:this={canvas}
      />
    </div>
  </Card>
</div>

<!-- TODO: This triggers on mobile when the user scrolls the page. Need to fix this. -->
<svelte:window on:resize={() => redrawChart(500)} />

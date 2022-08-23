<script lang="ts">
  import { Chart, registerables } from "chart.js";
  import { onMount } from "svelte";

  import moment from "moment";
  import "chartjs-adapter-moment";

  import Card from "$lib/Flowbite/Card.svelte";
  import Table from "$lib/Flowbite/Table.svelte";
  import { getRGB } from "$lib/js/utils";
  import {
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";

  Chart.register(...registerables);

  export let data: any;
  export let currency: string;

  for (let i = 0; i < data.length; i++) {
    data[i]["formattedTimestamp"] = moment
      .unix(data[i].x)
      .format("MMM Do YYYY, h:mm a");

    data[i].x *= 1000;
  }

  let canvas: HTMLCanvasElement;
  let currentChart: Chart;

  const lineData = {
    datasets: [
      {
        label: currency,
        data,
        tension: 0.1,
        pointRadius: 6,
        pointHoverRadius: 8,
        borderColor: getRGB("--color-secondary"),
        pointBackgroundColor: getRGB("--color-secondary"),
      },
    ],
  };

  function redrawChart() {
    currentChart.destroy();
    setTimeout(function () {
      try {
        drawChart();
      } catch (err) {
        // Chart.js bug that throws an an ugly exception in console
      }
    }, 500);
  }

  function drawChart() {
    currentChart = new Chart(canvas, {
      type: "line",
      options: {
        aspectRatio: 2 / 1,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: "week",
              displayFormats: {
                week: "MMM DD",
              },
            },
          },
          y: {
            grid: {
              display: true,
            },
          },
        },
      },
      data: lineData,
    });
  }

  onMount(() => {
    drawChart();
  });
</script>

<Card class={`${$$props.class}`} style="min-width: min(350px, 100%);">
  <h4 class="mb-3">Payouts</h4>
  <div class="flex-1 flex flex-wrap gap-10">
    <div class="flex-1" style="min-width: min(350px, 100%);">
      <canvas style="width: 210px; height: 210px;" bind:this={canvas} />
    </div>

    <Table class="flex-1">
      <TableHead>
        <TableHeadCell>Date</TableHeadCell>
        <TableHeadCell>Amount</TableHeadCell>
      </TableHead>
      <TableBody class="divide-y">
        {#each data as dataItem}
          <TableBodyRow class="">
            <TableBodyCell>{dataItem.formattedTimestamp}</TableBodyCell>
            <TableBodyCell>{dataItem.y + " " + currency}</TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  </div>
</Card>

<svelte:window on:resize|passive={redrawChart} />

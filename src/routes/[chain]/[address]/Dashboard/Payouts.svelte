<script lang="ts">
  import { Chart, registerables } from "chart.js";
  import { onMount } from "svelte";

  import {
    format,
    fromUnixTime,
    min,
    max,
    differenceInDays,
    startOfWeek,
    addDays,
  } from "date-fns";
  import "chartjs-adapter-date-fns";

  import Card from "$lib/Flowbite/Card.svelte";
  import Table from "$lib/Flowbite/Table.svelte";
  import TableHead from "$lib/Flowbite/utils/TableHead.svelte";
  import {
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHeadCell,
  } from "flowbite-svelte";
  import { getHexCode } from "$lib/js/utils";

  Chart.register(...registerables);

  export let data: any;
  export let currency: string;

  let canvas: HTMLCanvasElement;
  let currentChart: Chart;
  let configs = getConfigs(data);

  function getConfigs(data: string | any[]) {
    let configs = {
      unit: "",
      data: [],
      formattedTimestamps: [],
    };
    let dates = [];
    let formattedTimestamps = [];

    for (let i = 0; i < data.length; i++) {
      let unixDate = fromUnixTime(data[i].x);
      dates.push(unixDate);

      formattedTimestamps.push({
        x: data[i].x,
        y: data[i].y,
      });
    }

    formattedTimestamps = formattedTimestamps.sort((a, b) => b.x - a.x);
    formattedTimestamps = formattedTimestamps.map((item) => {
      let unixDate = fromUnixTime(item.x);
      let formattedTimestamp = format(unixDate, "MMM dd yyyy, h:mm a");

      return {
        x: formattedTimestamp,
        y: item.y,
      };
    });

    let minDate = min(dates),
      maxDate = max(dates),
      diff = differenceInDays(maxDate, minDate);

    if (diff <= 7) {
      configs.unit = "day";
    } else if (diff <= 7 * 6) {
      configs.unit = "week";
    } else if (diff <= 365) {
      configs.unit = "month";
    } else {
      configs.unit = "year";
    }

    for (let i = 0; i < dates.length; i++) {
      dates[i] = {
        date: dates[i],
        y: data[i].y,
      };
    }

    configs.formattedTimestamps = formattedTimestamps;
    configs.data = aggregateData(dates, configs.unit, diff);

    return configs;
  }

  function aggregateData(
    dates: string | any[],
    unit: string,
    daysBetween: number
  ) {
    if (dates.length == 0) return [];

    let dateFunc;
    let aggregatedDates = [];
    let allDates = [];

    switch (unit) {
      case "day":
        dateFunc = (date: Date) => format(date, "MMM dd");
        break;
      case "week":
        dateFunc = (date: Date) =>
          format(startOfWeek(date), "'Week of' MMM dd");
        break;
      case "month":
        dateFunc = (date: Date) => format(date, "MMM");
        break;
      default:
        dateFunc = (date: Date) => format(date, "yyyy");
        break;
    }

    let startDay = addDays(dates[0].date, 1);
    for (let i = 0; i < daysBetween; i++) {
      allDates.push({
        date: startDay,
        y: null,
      });

      startDay = addDays(startDay, 1);
    }

    allDates = [...allDates, ...dates];
    allDates.sort((a, b) => a.date.getTime() - b.date.getTime());

    for (let date of allDates) {
      aggregatedDates.push({
        date: dateFunc(date.date),
        y: date.y,
      });
    }

    let aggregatedDatesMap: any = {};
    for (let aggregateDate of aggregatedDates) {
      if (!aggregatedDatesMap[aggregateDate.date]) {
        aggregatedDatesMap[aggregateDate.date] = aggregateDate.y;
      } else {
        aggregatedDatesMap[aggregateDate.date] += aggregateDate.y;
      }
    }

    aggregatedDates = [];
    for (let [key, value] of Object.entries(aggregatedDatesMap)) {
      aggregatedDates.push({
        x: key,
        y: value,
      });
    }

    return aggregatedDates;
  }

  let barData = {
    datasets: [
      {
        backgroundColor: getHexCode("--color-tertiary"),
        label: currency,
        data: configs.data,
        maxBarThickness: 100,
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
      type: "bar",
      grouped: false,
      options: {
        responsive: true,
        aspectRatio: 2 / 1,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            offset: true,
            grid: {
              display: false,
              drawBorder: false,
            },
          },
          y: {
            offset: true,
            startAtZero: true,
            drawBorder: false,
          },
        },
      },
      data: barData,
    });
  }

  onMount(() => {
    drawChart();
  });
</script>

<div class={`${$$props.class}`} style="min-width: min(400px, 100%);">
  <Card class="h-full">
    <h4 class="mb-3">Payments Made</h4>
    <div class="flex-1 flex flex-wrap gap-6">
      <div class="flex-1" style="min-width: min(400px, 100%);">
        <canvas style="width: 210px; height: 210px;" bind:this={canvas} />
      </div>

      <Table
        noborder={false}
        class="flex-1 rounded-lg min-w-[min(340px,100%)] max-h-[195px]"
      >
        <TableHead>
          <TableHeadCell>Date</TableHeadCell>
          <TableHeadCell>Amount</TableHeadCell>
        </TableHead>
        <TableBody class="divide-y">
          {#each configs.formattedTimestamps as dataItem}
            <TableBodyRow class="">
              <TableBodyCell>{dataItem.x}</TableBodyCell>
              <TableBodyCell>{dataItem.y + " " + currency}</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    </div>
  </Card>
</div>

<!-- TODO: This triggers on mobile when the user scrolls the page. Need to fix this. -->
<svelte:window on:resize={redrawChart} />

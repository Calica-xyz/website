<script lang="ts">
    import { Chart, registerables } from "chart.js";
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from "flowbite-svelte";

    import moment from "moment";
    import "chartjs-adapter-moment";

    import { Card } from "flowbite-svelte";

    Chart.register(...registerables);

    export let data;
    export let currency;

    let className;
    export { className as class };

    for (let i = 0; i < data.length; i++) {
        data[i]["formattedTimestamp"] = moment
            .unix(data[i].x)
            .format("MMMM Do YYYY, h:mm:ss a");

        data[i].x *= 1000;
    }

    import { onMount } from "svelte";

    let canvas: HTMLCanvasElement;
    let currentChart;

    const lineData = {
        datasets: [
            {
                label: currency,
                data,
                tension: 0.1,
                pointRadius: 6,
                pointHoverRadius: 8,
                borderColor: "#46BFBD",
                pointBackgroundColor: "#46BFBD",
            },
        ],
    };

    function redrawChart() {
        currentChart.destroy();
        drawChart();
    }

    function drawChart() {
        currentChart = new Chart(canvas, {
            type: "line",
            options: {
                scales: {
                    x: {
                        type: "time",
                        grid: {
                            display: false,
                        },
                        time: {
                            unit: "week",
                            displayFormats: {
                                week: "MMM DD",
                            },
                        },
                    },
                    y: {
                        grid: {
                            display: false,
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

<Card
    class="max-w-4xl {className}"
    style="min-width: min(600px, calc(100% - 4rem));"
>
    <h4>Payouts</h4>
    <canvas class="mb-6" bind:this={canvas} />

    <Table>
        <TableHead>
            <TableHeadCell>Date</TableHeadCell>
            <TableHeadCell>Amount</TableHeadCell>
        </TableHead>
        <TableBody class="divide-y">
            {#each data as dataItem}
                <TableBodyRow>
                    <TableBodyCell>{dataItem.formattedTimestamp}</TableBodyCell>
                    <TableBodyCell>{dataItem.y + " " + currency}</TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</Card>

<svelte:window on:resize|passive={redrawChart} />

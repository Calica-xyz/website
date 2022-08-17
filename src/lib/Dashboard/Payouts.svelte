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

    import Card from "$lib/Flowbite/Card.svelte";

    Chart.register(...registerables);

    export let data;

    for (let i = 0; i < data.length; i++) {
        data[i]["formattedTimestamp"] = moment
            .unix(data[i].x)
            .format("MMM Do YYYY, h:mm a");

        data[i].x *= 1000;
    }

    export let currency;

    let className = "";
    export { className as class };

    import { onMount } from "svelte";

    let canvas: HTMLCanvasElement;
    let currentChart;
    let style = getComputedStyle(document.body);

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

    function getRGB(name) {
        let split = style.getPropertyValue(name).trim().split(" ");
        console.log(split);

        return `rgb(${split[0]},${split[1]},${split[2]})`;
    }

    function redrawChart() {
        currentChart.destroy();
        drawChart();
    }

    function drawChart() {
        currentChart = new Chart(canvas, {
            type: "line",
            options: {
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

<Card class="max-w-4xl {className}" style="min-width: min(350px, 100%);">
    <h4 class="mb-3">Payouts</h4>
    <canvas
        style="width: 210px; height: 210px;"
        class="mb-6"
        bind:this={canvas}
    />

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

<script lang="ts">
    import { Chart, registerables } from "chart.js";

    Chart.register(...registerables);

    export let data;

    let classData;
    export { classData as class };

    import { onMount } from "svelte";

    let canvas: HTMLCanvasElement;
    let currentChart;

    let chartData = {
        labels: [data.labels],
        datasets: [
            {
                data: data.splits,
                backgroundColor: ["#46BFBD"],
                hoverBackgroundColor: ["#5AD3D1"],
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
                            label: (item) => `${item.raw}%`,
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

<div class="m-auto max-w-sm {classData}">
    <canvas bind:this={canvas} />
</div>

<svelte:window on:resize|passive={redrawChart} />

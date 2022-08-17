<script lang="ts">
    import { Chart, registerables } from "chart.js";

    Chart.register(...registerables);

    export let data;

    let className = "";
    export { className as class };

    import { onMount } from "svelte";

    let style = getComputedStyle(document.body);
    let canvas: HTMLCanvasElement;
    let currentChart;

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

<div class={className}>
    <canvas style="width: 210px; height: 210px;" bind:this={canvas} />
</div>

<svelte:window on:resize|passive={redrawChart} />

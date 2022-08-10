<script lang="ts">
    export let data;

    import { Chart } from "chart.js";

    import { onMount } from "svelte";

    let canvas: HTMLCanvasElement;

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

    onMount(() => {
        new Chart(canvas, {
            type: "doughnut",
            data: chartData,
        });
    });
</script>

<canvas bind:this={canvas} />

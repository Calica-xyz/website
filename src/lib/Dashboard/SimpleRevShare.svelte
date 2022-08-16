<script>
    export let data;

    import { Card } from "flowbite-svelte";
    import Doughnut from "$lib/Dashboard/Doughnut.svelte";

    let className;
    export { className as class };
</script>

<Card class="max-w-4xl min-w-sm {className}">
    <h4 class="mb-6">Agreement</h4>
    <Doughnut class="" {data} />
</Card>

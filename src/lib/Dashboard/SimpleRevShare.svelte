<script>
    export let data;

    import Card from "$lib/Flowbite/Card.svelte";
    import Doughnut from "$lib/Dashboard/Doughnut.svelte";

    let className = "";
    export { className as class };
</script>

<Card class="max-w-2xl {className}" style="min-width: min(250px, 100%);">
    <h4 class="mb-6">Agreement</h4>
    <Doughnut {data} />
</Card>

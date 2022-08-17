<script>
    export let amount;
    export let currency;

    let className = "";
    export { className as class };

    import Card from "$lib/Flowbite/Card.svelte";
</script>

<Card class="{className} text-center">
    <h5>Total Earned</h5>
    <h1>
        {amount}
        <p class="subtitle-text">{currency}</p>
    </h1>
</Card>

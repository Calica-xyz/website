<script>
    export let amount;
    export let currency;

    let className;
    export { className as class };

    import { Card } from "flowbite-svelte";
</script>

<Card class="max-w-xl {className} text-center">
    <h5>Total Earned</h5>
    <h1>
        {amount}
        <p class="subtitle-text">{currency}</p>
    </h1>
</Card>

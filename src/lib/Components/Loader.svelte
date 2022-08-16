<script>
    import { Spinner } from "flowbite-svelte";
</script>

<div id="spinner-container" class="grid place-items-center">
    <Spinner size="20" />
</div>

<style>
    #spinner-container {
        height: calc(100vh - 280px); /* Viewport - navbar + footer */
    }
</style>

<script>
    import Spinner from "$lib/Flowbite/Spinner.svelte";
</script>

<div id="spinner-container" class="grid place-items-center">
    <Spinner size="20" />
</div>

<style>
    #spinner-container {
        height: calc(100vh - 280px); /* Viewport - navbar + footer */
    }
</style>

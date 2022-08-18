<script lang="ts">
  export let data: any;

  import Card from "$lib/Flowbite/Card.svelte";
  import Doughnut from "$lib/Dashboard/Doughnut.svelte";
</script>

<Card class={`max-w-xl ${$$props.class}`} style="min-width: min(250px, 100%);">
  <h4 class="mb-6">Agreement</h4>
  <Doughnut {data} />
</Card>

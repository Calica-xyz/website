<script lang="ts">
  export let data: any;

  import Card from "$lib/Flowbite/Card.svelte";
  import Doughnut from "$lib/Dashboard/Doughnut.svelte";

  export let isOwner: boolean;

  $: title = isOwner ? "Revenue Share" : "Your Share";
</script>

<Card class={`${$$props.class}`} style="min-width: min(250px, 100%);">
  <h4 class="mb-6">{title}</h4>
  <div class="flex-1 flex items-center justify-center">
    <Doughnut class="max-w-[400px] w-full" {data} />
  </div>
</Card>

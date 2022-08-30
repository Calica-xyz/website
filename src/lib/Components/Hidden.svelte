<script>
  export let shown = false;

  export const show = () => {
    shown = true;
  };

  export const dismiss = () => {
    shown = false;
  };
</script>

{#if shown}
  <slot />
{/if}

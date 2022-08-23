<script lang="ts">
  import { createForm } from "felte";
  import { fly } from "svelte/transition";

  import ButtonGroup from "$lib/Flowbite/ButtonGroup.svelte";

  export let initialValues;
  export let pagesState;
  export let onSubmit;
  export let onBack;

  let isDeploying = false;

  const { form, data } = createForm({ onSubmit });
</script>

<form use:form>
  <div
    in:fly={{ x: 500, duration: 500 }}
    class="max-w-4xl mx-auto sm:px-12 my-14"
  >
    <ButtonGroup
      isFinal={true}
      bind:isLoadingFinal={isDeploying}
      class="mb-8 float-right"
      buttonNames={["Prev", "Deploy"]}
      buttonCallbacks={[
        () => onBack($data),
        () => {
          isDeploying = true;
          setTimeout(() => {
            isDeploying = false;
          }, 3000);
        },
      ]}
      buttonTypes={["button", "submit"]}
    />
  </div>
</form>

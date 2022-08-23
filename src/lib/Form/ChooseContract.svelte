<!-- Tailwind UI component: https://tailwindui.com/components/application-ui/feedback/empty-states#component-fdd158a00f60e3f9cdf9415b5835e139 -->
<script lang="ts">
  import { createForm } from "felte";
  import { ChartPie, ChartBar, ChevronRight } from "svelte-heros";
  import { fly } from "svelte/transition";

  export let initialValues;
  export let pagesState;
  export let onSubmit;
  export let onBack;

  const { form, data, setData } = createForm({ onSubmit });

  function clickMilestone() {
    setData({ type: "capped" });
    onSubmit($data);
  }

  function clickBasic() {
    setData({ type: "simple" });
    onSubmit($data);
  }
</script>

<form use:form>
  <div in:fly={{ x: 500, duration: 500 }} class="max-w-xl mx-auto my-14">
    <h4 class="text-gray-600">Create a new Smart Contract Agreement</h4>
    <p class="subtitle-text text-gray-500">Select a type of revenue share</p>
    <ul
      class="shadow rounded-lg mt-8 border border-gray-200 divide-y divide-gray-200"
    >
      <li
        on:click={clickBasic}
        class="cursor-pointer rounded-t-lg px-6 hover:bg-gray-100"
      >
        <div class="bg-blue relative group py-4 flex items-start space-x-3">
          <div class="bg-blue flex-shrink-0">
            <span
              class="bg-blue inline-flex items-center justify-center h-10 w-10 rounded-lg bg-secondary"
            >
              <ChartPie class="text-white" size="25" />
            </span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="font-medium text-gray-800 group-hover:text-black">
              <span class="absolute inset-0" aria-hidden="true" />
              Basic Revenue Share
            </div>
            <p class="subtitle-text text-gray-400 group-hover:text-gray-700">
              All funds are split between parties
            </p>
          </div>
          <div class="flex-shrink-0 self-center">
            <ChevronRight
              class="text-gray-400 group-hover:text-gray-700"
              size="16"
            />
          </div>
        </div>
      </li>

      <li
        on:click={clickMilestone}
        class="cursor-pointer rounded-b-lg px-6 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <div class="relative group py-4 flex items-start space-x-3">
          <div class="flex-shrink-0">
            <span
              class="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-tertiary"
            >
              <ChartBar class="text-white" size="25" />
            </span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="font-medium text-gray-800 group-hover:text-black">
              <span class="absolute inset-0" aria-hidden="true" />
              Milestone-based Revenue Share
            </div>
            <p class="subtitle-text text-gray-400 group-hover:text-gray-700">
              Different splits after certain milestones
            </p>
          </div>
          <div class="flex-shrink-0 self-center">
            <ChevronRight
              class="text-gray-400 group-hover:text-gray-700"
              size="16"
            />
          </div>
        </div>
      </li>
    </ul>
  </div>
</form>

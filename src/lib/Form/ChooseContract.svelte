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
  <div class="max-w-xl mx-auto my-4">
    <h3 class="text-gray-700">Create a new Revenue Share Agreement</h3>
    <ul
      class="shadow rounded-lg mt-12 border border-gray-200 divide-y divide-gray-200"
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
            <h5 class="text-gray-500">Basic Revenue Share</h5>

            <p class="subtitle-text text-gray-400">
              All funds are split between parties
            </p>
          </div>
          <div class="flex-shrink-0 self-center">
            <ChevronRight class="text-gray-400" size="16" />
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
              class="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-accent"
            >
              <ChartBar class="text-white" size="25" />
            </span>
          </div>
          <div class="min-w-0 flex-1">
            <h5 class="text-gray-500">Milestone-based Revenue Share</h5>
            <p class="subtitle-text text-gray-400 ">
              Different splits after certain revenue milestones are hit
            </p>
          </div>
          <div class="flex-shrink-0 self-center">
            <ChevronRight class="text-gray-400" size="16" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</form>

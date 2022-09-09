<!-- This component is derived from the Tailwind UI Steps component: https://tailwindui.com/components/application-ui/navigation/steps#component-ef491b1515ff05e8cc7429f37bc0fae5 -->
<script lang="ts">
  export let stepNames: string[];
  export let currentStep: number = 0;

  let maxWidth = stepNames.length * 250;
  $: completedSteps = stepNames.slice(0, currentStep);
  $: remainingSteps = stepNames.slice(currentStep + 1);
</script>

<nav
  aria-label="Progress"
  class="relative m-auto p-10"
  style={`max-width: ${maxWidth}px;`}
>
  <ol
    class="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm divide-y divide-gray-300 md:flex md:divide-y-0"
  >
    {#each completedSteps as completedStep, i}
      <li class="relative md:flex-1 md:flex">
        <!-- Completed Steps -->
        <div class="group flex items-center w-full">
          <span class="px-6 py-4 flex items-center text-sm font-medium">
            <span
              class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary rounded-full"
            >
              <svg
                class="w-6 h-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span class="ml-4 text-sm font-medium text-gray-900"
              >{completedStep}</span
            >
          </span>
        </div>

        {#if i < stepNames.length - 1}
          <!-- Arrow separator for lg screens and up -->
          <div
            class="hidden md:block absolute top-0 right-0 h-full w-5"
            aria-hidden="true"
          >
            <svg
              class="h-full w-full text-gray-300"
              viewBox="0 0 22 80"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 -2L20 40L0 82"
                vector-effect="non-scaling-stroke"
                stroke="currentcolor"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        {/if}
      </li>
    {/each}

    {#if currentStep < stepNames.length}
      <li class="relative md:flex-1 md:flex">
        <!-- Current Step -->
        <div
          class="px-6 py-4 flex items-center text-sm font-medium"
          aria-current="step"
        >
          <span
            class="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-primary rounded-full"
          >
            <span class="text-primary">{`0${currentStep + 1}`}</span>
          </span>
          <span class="ml-4 text-sm font-medium text-primary"
            >{stepNames[currentStep]}</span
          >
        </div>

        {#if currentStep < stepNames.length - 1}
          <!-- Arrow separator for lg screens and up -->
          <div
            class="hidden md:block absolute top-0 right-0 h-full w-5"
            aria-hidden="true"
          >
            <svg
              class="h-full w-full text-gray-300"
              viewBox="0 0 22 80"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 -2L20 40L0 82"
                vector-effect="non-scaling-stroke"
                stroke="currentcolor"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        {/if}
      </li>
    {/if}

    {#each remainingSteps as remainingStep, i}
      <li class="relative md:flex-1 md:flex">
        <!-- Upcoming Steps -->
        <div class="group flex items-center">
          <span class="px-6 py-4 flex items-center text-sm font-medium">
            <span
              class="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full"
            >
              <span class="text-gray-500"
                >{`0${i + completedSteps.length + 1 + 1}`}</span
              >
            </span>
            <span class="ml-4 text-sm font-medium text-gray-500"
              >{remainingStep}</span
            >
          </span>
        </div>

        {#if i + completedSteps.length + 1 < stepNames.length - 1}
          <!-- Arrow separator for lg screens and up -->
          <div
            class="hidden md:block absolute top-0 right-0 h-full w-5"
            aria-hidden="true"
          >
            <svg
              class="h-full w-full text-gray-300"
              viewBox="0 0 22 80"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 -2L20 40L0 82"
                vector-effect="non-scaling-stroke"
                stroke="currentcolor"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

<!-- Tailwind UI component: https://tailwindui.com/components/application-ui/feedback/empty-states#component-fdd158a00f60e3f9cdf9415b5835e139 -->
<script lang="ts">
  import { goto } from "$app/navigation";

  import { createForm } from "felte";
  import {
    ChartPie,
    ChartBar,
    ChevronRight,
    Cash,
    UserGroup,
    Calculator,
    LightBulb,
  } from "svelte-heros";

  export let initialValues;
  export let pagesState;
  export let onSubmit;
  export let onBack;

  const agreements = [
    {
      title: "Basic Revenue Share",
      subtitle: "All funds are split between parties",
      icon: ChartPie,
      color: "bg-primary-300",
      enabled: true,
      type: "simple",
    },
    {
      title: "Milestone-based Revenue Share",
      subtitle: "Different splits after certain revenue milestones are hit",
      icon: ChartBar,
      color: "bg-secondary-200",
      enabled: true,
      type: "capped",
    },
    {
      title: "Profit-only Distribution",
      subtitle: "Distribute profits after costs are subtracted",
      icon: Calculator,
      color: "bg-gray-300",
      enabled: false,
      type: "profit",
    },
    {
      title: "Primary & Secondary Splits",
      subtitle: "Create separate splits for primary and secondary NFT sales",
      icon: Cash,
      color: "bg-gray-300",
      enabled: false,
      type: "nft",
    },
    {
      title: "Distribute Revenue to NFT Holders",
      subtitle:
        "Instead of wallets, funds are distributed to active NFT holders",
      icon: UserGroup,
      color: "bg-gray-300",
      enabled: false,
      type: "nft-holders",
    },
  ];

  const { form, data, setData } = createForm({ onSubmit });

  function chooseAgreement(type) {
    setData({ type });
    onSubmit($data);
  }
</script>

<form use:form>
  <div class="max-w-2xl mx-auto my-4">
    <h3 class="text-gray-700">Create a new Revenue Share Agreement</h3>
    <ul
      class="shadow rounded-lg mt-12 border border-gray-200 divide-y divide-gray-200"
    >
      {#each agreements as agreement}
        <li
          on:click={() => {
            if (agreement.enabled) {
              chooseAgreement(agreement.type);
            } else {
              goto("/contact");
            }
          }}
          class="cursor-pointer rounded-t-lg px-6 hover:bg-gray-100"
        >
          <div class="relative group py-4 flex items-start space-x-3">
            <div class="flex-shrink-0">
              <span
                class="{agreement.color} inline-flex items-center justify-center h-10 w-10 rounded-lg"
              >
                <svelte:component
                  this={agreement.icon}
                  class="text-white"
                  size="25"
                />
              </span>
            </div>
            <div class="min-w-0 flex-1">
              <h5 class="text-gray-500">{agreement.title}</h5>
              <p class="subtitle-text text-gray-400">
                {agreement.subtitle}
              </p>
            </div>
            <div class="flex-shrink-0 self-center">
              {#if agreement.enabled}
                <ChevronRight class="text-gray-400 group-hover:text-gray-500" />
              {:else}
                <span class="text-xs italic text-gray-400">Contact Calica</span>
              {/if}
            </div>
          </div>
        </li>
      {/each}
    </ul>

    <div class="max-w-[500px]">
      <a href="/contact">
        <div
          class="hover:bg-yellow-50 border p-3 rounded-lg border-dashed mt-12 flex gap-3 items-center"
        >
          <LightBulb size="40" class="text-yellow-200" />
          <p class="flex-1 subtitle-text text-gray-600">
            Don't see what you're looking for? We love hearing about new use
            cases and are happy to build something custom!
          </p>

          <ChevronRight
            size="16"
            class="text-gray-400 group-hover:text-gray-500"
          />
        </div>
      </a>
    </div>
  </div>
</form>

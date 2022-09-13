<script lang="ts">
  import {
    Cash,
    ChartBar,
    ChartPie,
    Cube,
    LightBulb,
    UserGroup,
  } from "svelte-heros";

  const useCases = [
    {
      title: "Royalty flexibility",
      description:
        "Set different revenue shares for primary and secondary sales of NFTs.",
      icon: Cash,
    },
    {
      title: "Distribute revenue to NFT holders",
      description:
        "Direct revenue streams towards NFTs for IP, trading, and more.",
      icon: UserGroup,
    },
    {
      title: "Revenue milestones",
      description:
        "Adjust distribution rates when revenue thresholds are hit to cap earnings.",
      icon: ChartBar,
    },
    {
      title: "Profit-only distributions",
      description: "Submit costs to distribute profits to connected parties.",
      icon: ChartPie,
    },
    {
      title: "Platform plugin integration",
      description:
        "Integrate into your product's UI to empower users with complex rev share capability.",
      icon: Cube,
    },
    {
      title: "Custom use case",
      description:
        "We're always open to new ideas. Let us know what you need and we'll create a custom solution for your business needs.",
      icon: LightBulb,
    },
  ];
</script>

<div class="py-16">
  <div class="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
    <div class="lg:text-center">
      <h2 class="text-lg font-semibold text-primary-100">The Solution</h2>
      <p
        class="mt-2 text-4xl font-bold tracking-tight text-gray-800 lg:text-5xl"
      >
        Calica empowers you with revenue tooling
      </p>
      <p class="mt-4 max-w-2xl text-md sm:text-lg text-gray-500 lg:mx-auto">
        With Calica, revenue is automatically distributed according to your
        business needs.
      </p>
    </div>

    <div class="mt-16">
      <dl
        class="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0"
      >
        {#each useCases as useCase}
          <div class="relative">
            <dt>
              <div
                class="{useCase.title == 'Custom use case'
                  ? 'bg-primary-800'
                  : 'bg-primary-300'} absolute flex h-12 w-12 items-center justify-center rounded-md text-white"
              >
                <svelte:component this={useCase.icon} />
              </div>
              <p class="ml-16 font-semibold text-lg leading-6 text-gray-800">
                {useCase.title}
              </p>
            </dt>
            <dd class="mt-2 ml-16 text-base text-gray-500">
              {useCase.description}
            </dd>
          </div>
        {/each}
      </dl>
    </div>
  </div>
</div>

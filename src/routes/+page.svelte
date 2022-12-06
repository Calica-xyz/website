<script lang="ts">
  import Contact from "$lib/Landing/Contact.svelte";
  import HowItWorks from "$lib/Landing/HowItWorks.svelte";
  import LogoCloud from "$lib/Landing/LogoCloud.svelte";
  import ProblemCircle from "$lib/Landing/ProblemCircle.svelte";
  import Security from "$lib/Landing/Security.svelte";
  import UseCases from "$lib/Landing/UseCases.svelte";

  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  $: navbarOpen = false;
  $: headerVisited = false;

  onMount(async () => {
    const headerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          headerVisited = true;
        }
      });
    });

    headerObserver.observe(document.querySelector(".header-text"));
  });
</script>

<svelte:head>
  <title>Use Calica</title>
  <meta charset="utf-8" />
</svelte:head>

<div class="bg-gray-50">
  <div class="relative overflow-hidden">
    <div class="absolute inset-y-0 h-full w-full" aria-hidden="true">
      <div class="relative h-full">
        <svg
          class="absolute right-full translate-y-1/3 translate-x-1/4 transform sm:translate-x-1/2 md:translate-y-1/2 lg:translate-x-full"
          width="404"
          height="784"
          fill="none"
          viewBox="0 0 404 784"
        >
          <defs>
            <pattern
              id="e229dbec-10e9-49ee-8ec3-0286ca089edf"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="0"
                y="0"
                width="4"
                height="4"
                class="text-gray-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width="404"
            height="784"
            fill="url(#e229dbec-10e9-49ee-8ec3-0286ca089edf)"
          />
        </svg>
        <svg
          class="absolute left-full -translate-y-3/4 -translate-x-1/4 transform sm:-translate-x-1/2 md:-translate-y-1/2 lg:-translate-x-3/4"
          width="404"
          height="784"
          fill="none"
          viewBox="0 0 404 784"
        >
          <defs>
            <pattern
              id="d2a68204-c383-44b1-b99f-42ccff4e5365"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="0"
                y="0"
                width="4"
                height="4"
                class="text-gray-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width="404"
            height="784"
            fill="url(#d2a68204-c383-44b1-b99f-42ccff4e5365)"
          />
        </svg>
      </div>
    </div>

    <div class="relative pt-6 pb-16 sm:pb-24">
      <div>
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <nav
            class="relative flex items-center justify-between sm:h-10 md:justify-center"
            aria-label="Global"
          >
            <div
              class="flex flex-1 items-center md:absolute md:inset-y-0 md:left-0"
            >
              <div class="flex w-full items-center justify-between md:w-auto">
                <span class="sr-only">Calica Logo</span>
                <img
                  class="h-8 w-auto sm:h-10"
                  src="/logo.png"
                  alt="Calica Logo"
                />
                <div class="-mr-2 flex items-center md:hidden">
                  <button
                    on:click={() => {
                      navbarOpen = true;
                    }}
                    type="button"
                    class="inline-flex items-center justify-center rounded-md bg-gray-50 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                    aria-expanded="false"
                  >
                    <span class="sr-only">Open main menu</span>
                    <!-- Heroicon name: outline/bars-3 -->
                    <svg
                      class="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="hidden md:flex md:space-x-7">
              <a
                href="#why-calica"
                class="font-medium text-gray-500 hover:text-gray-900"
                >Why Calica</a
              >

              <a
                href="#use-cases"
                class="font-medium text-gray-500 hover:text-gray-900"
                >Use cases</a
              >

              <a
                href="#how-it-works"
                class="font-medium text-gray-500 hover:text-gray-900"
                >How it works</a
              >

              <a
                href="#security"
                class="font-medium text-gray-500 hover:text-gray-900"
                >Security</a
              >
            </div>
            <div
              class="hidden md:absolute md:inset-y-0 md:right-0 md:flex md:items-center md:justify-end"
            >
              <span class="inline-flex rounded-md shadow">
                <a
                  target="_blank"
                  href="https://calendly.com/calicaadam/calica-consultation"
                  class="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-primary-500 hover:bg-gray-50"
                  >Book a Demo</a
                >
              </span>
            </div>
          </nav>
        </div>

        {#if navbarOpen}
          <div
            class="absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden"
          >
            <div
              class="overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black ring-opacity-5"
            >
              <div class="flex items-center justify-between px-5 pt-4">
                <div>
                  <img class="h-8 w-auto" src="/logo.png" alt="Calica Logo" />
                </div>
                <div class="-mr-2">
                  <button
                    on:click={() => {
                      navbarOpen = false;
                    }}
                    type="button"
                    class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  >
                    <span class="sr-only">Close main menu</span>
                    <!-- Heroicon name: outline/x-mark -->
                    <svg
                      class="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="space-y-1 px-2 pt-2 pb-3">
                <a
                  href="#why-calica"
                  class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >Why Calica</a
                >

                <a
                  href="#use-cases"
                  class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >Use cases</a
                >

                <a
                  href="#how-it-works"
                  class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >How it works</a
                >

                <a
                  href="#security"
                  class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >Security</a
                >
              </div>
              <a
                target="_blank"
                href="https://calendly.com/calicaadam/calica-consultation"
                class="block w-full bg-gray-50 px-5 py-3 text-center font-medium text-primary-500 hover:bg-gray-100 hover:text-primary-600"
                >Book a Demo</a
              >
            </div>
          </div>
        {/if}
      </div>

      <div class="h-[200px] text-center header-text mt-16 max-w-7xl sm:mt-24">
        {#if headerVisited}
          <div in:fade={{ duration: 500 }} class="w-full absolute px-4 sm:px-6">
            <h1
              class="text-4xl font-bold tracking-tight text-other-800 sm:text-5xl md:text-6xl"
            >
              <span class="block">Manage and automate your</span>
              <span class="block text-primary">on-chain revenue</span>
            </h1>
            <p
              class="mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 max-w-xl md:text-xl"
            >
              Use Calica to simplify the way your team manages finances in web3
            </p>
          </div>
        {/if}
      </div>
    </div>

    <div class="relative">
      <div class="absolute inset-0 flex flex-col" aria-hidden="true">
        <div class="flex-1" />
        <div class="w-full flex-1 bg-gray-900" />
      </div>
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <img
          class="relative rounded-lg shadow-lg"
          src="/AppScreenshot.png"
          alt="App screenshot"
        />
      </div>
    </div>
  </div>
  <div class="bg-gray-900">
    <LogoCloud />
  </div>

  <section id="why-calica" class="m-auto">
    <div
      id="why-calica-content"
      class="m-auto max-w-7xl flex flex-wrap gap-x-24 gap-y-8 items-center justify-center"
    >
      <div
        id="problems-text"
        class="text-center flex-1 min-w-[min(400px,100%)] max-w-[max(500px,100%)]"
      >
        <h1
          class="text-4xl font-bold tracking-tight text-other-800 lg:text-5xl"
        >
          <span class="inline">The </span>
          <span class="text-accent-500 inline">challenges</span>
          <span class="inline">with on-chain revenue </span>
        </h1>
        <p class="mt-3 text-md text-gray-500 sm:text-lg md:mt-5">
          Your business earned crypto, but now what?
        </p>
      </div>
      <div class="flex-auto min-w-[min(580px,100%)] max-w-[600px]">
        <ProblemCircle />
      </div>
    </div>
  </section>

  <section
    id="use-cases"
    class="bg-gradient-to-b from-gray-50 to-gray-50 via-primary-100"
  >
    <UseCases />
  </section>

  <section id="how-it-works">
    <div
      class="m-auto max-w-7xl flex flex-wrap-reverse gap-x-24 gap-y-20 items-center justify-center"
    >
      <div class="flex-auto min-w-[min(580px,100%)] max-w-[600px]">
        <HowItWorks />
      </div>
      <div
        class="text-center flex-1 min-w-[min(400px,100%)] max-w-[max(500px,100%)]"
      >
        <h1 class="text-4xl font-bold tracking-tight text-gray-800 lg:text-5xl">
          <span class="inline">How it </span>
          <span class="text-primary-400 inline">works</span>
        </h1>
        <p
          class="mt-3 text-md text-gray-500 sm:text-lg md:mt-5 max-w-[650px] m-auto"
        >
          Using Calica is easy. <a class="hover:underline" href="/create"
            >Our app</a
          > runs on Ethereum, Polygon and all other EVM-compatible chains.
        </p>
      </div>
    </div>
  </section>

  <section id="security">
    <Security />
  </section>

  <section id="contact">
    <Contact />
  </section>

  <footer class="mt-10">
    <div class="mx-auto max-w-7xl overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <nav
        class="-mx-5 -my-2 flex flex-wrap justify-center"
        aria-label="Footer"
      >
        <div class="px-5 py-2">
          <a href="/create" class="text-base text-gray-500 hover:text-gray-900"
            >Calica App</a
          >
        </div>

        <div class="px-5 py-2">
          <a href="contact" class="text-base text-gray-500 hover:text-gray-900"
            >Contact Us</a
          >
        </div>

        <div class="px-5 py-2">
          <a href="/blog" class="text-base text-gray-500 hover:text-gray-900"
            >Blog</a
          >
        </div>

        <div class="px-5 py-2">
          <a
            href="/my-contracts"
            class="text-base text-gray-500 hover:text-gray-900"
            >View Contracts</a
          >
        </div>
      </nav>
      <div class="mt-8 flex justify-center space-x-6">
        <a
          href="https://twitter.com/CalicaXYZ"
          target="_blank"
          class="text-gray-400 hover:text-gray-500"
        >
          <span class="sr-only">Twitter</span>
          <svg
            class="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
            />
          </svg>
        </a>

        <a
          href="https://www.linkedin.com/company/calicaxyz/about/"
          target="_blank"
          class="text-gray-400 hover:text-gray-500"
        >
          <span class="sr-only">LinkedIn</span>
          <svg fill="currentColor" class="h-6 w-6" viewBox="0 0 30 30">
            <path
              d="M9,25H4V10h5V25z M6.501,8C5.118,8,4,6.879,4,5.499S5.12,3,6.501,3C7.879,3,9,4.121,9,5.499C9,6.879,7.879,8,6.501,8z M27,25h-4.807v-7.3c0-1.741-0.033-3.98-2.499-3.98c-2.503,0-2.888,1.896-2.888,3.854V25H12V9.989h4.614v2.051h0.065 c0.642-1.18,2.211-2.424,4.551-2.424c4.87,0,5.77,3.109,5.77,7.151C27,16.767,27,25,27,25z"
            /></svg
          >
        </a>
      </div>
      <p class="mt-8 text-center text-base text-gray-400">
        &copy; 2022 Calica Inc. All rights reserved.
      </p>
    </div>
  </footer>
</div>

<style>
  section {
    padding-top: 7rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  @media (min-width: 1024px) {
    section {
      padding-left: 5rem;
      padding-right: 5rem;
    }
  }

  @media (min-width: 1246px) {
    #problems-text {
      text-align: start;
    }

    #why-calica {
      padding-top: 0;
      margin-top: -3rem;
    }
  }

  @media (max-width: 550px) {
    #why-calica-content {
      row-gap: 45px;
    }
  }
</style>

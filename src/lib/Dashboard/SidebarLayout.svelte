<script lang="ts">
  import { Code, Cog, ChartBar } from "svelte-heros";

  export let page;

  $: sidebarOpen = false;

  function clickOutside(element, callbackFunction) {
    let func = function onClick(event) {
      if (
        !element.contains(event.target) &&
        !document.getElementById("sidebar-toggle")?.contains(event.target)
      ) {
        callbackFunction();
      }
    };

    document.addEventListener("click", func);

    return {
      update(newCallbackFunction) {
        callbackFunction = newCallbackFunction;
      },
      destroy() {
        document.body.removeEventListener("click", func);
      },
    };
  }
</script>

<div>
  <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
  {#if sidebarOpen}
    <div class="relative z-40 md:hidden" role="dialog" aria-modal="true">
      <!--
        Off-canvas menu backdrop, show/hide based on off-canvas menu state.
  
        Entering: "transition-opacity ease-linear duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "transition-opacity ease-linear duration-300"
          From: "opacity-100"
          To: "opacity-0"
      -->
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />

      <div class="fixed inset-0 z-40 flex">
        <!--
          Off-canvas menu, show/hide based on off-canvas menu state.
  
          Entering: "transition ease-in-out duration-300 transform"
            From: "-translate-x-full"
            To: "translate-x-0"
          Leaving: "transition ease-in-out duration-300 transform"
            From: "translate-x-0"
            To: "-translate-x-full"
        -->
        <div
          use:clickOutside={() => {
            sidebarOpen = false;
          }}
          class="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800"
        >
          <!--
            Close button, show/hide based on off-canvas menu state.
  
            Entering: "ease-in-out duration-300"
              From: "opacity-0"
              To: "opacity-100"
            Leaving: "ease-in-out duration-300"
              From: "opacity-100"
              To: "opacity-0"
          -->
          <div class="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              on:click={() => {
                sidebarOpen = false;
              }}
            >
              <span class="sr-only">Close sidebar</span>
              <!-- Heroicon name: outline/x-mark -->
              <svg
                class="h-6 w-6 text-white"
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

          <div class="h-0 flex-1 overflow-y-auto pt-5 pb-4">
            <div class="flex flex-shrink-0 items-center px-4">
              <img
                class="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
              />
            </div>
            <nav class="mt-5 space-y-1 px-2">
              <div
                on:click={() => {
                  page = 0;
                }}
                class="{page == 0
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'} cursor-pointer group flex items-center px-2 py-2 text-base font-medium rounded-md"
              >
                <ChartBar
                  class="{page == 0
                    ? 'text-gray-300'
                    : 'text-gray-400 group-hover:text-gray-300'} mr-3 flex-shrink-0 h-6 w-6"
                />
                Dashboard
              </div>

              <div
                on:click={() => {
                  page = 1;
                }}
                class="{page == 1
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'} cursor-pointer group flex items-center px-2 py-2 text-base font-medium rounded-md"
              >
                <Code
                  class="{page == 1
                    ? 'text-gray-300'
                    : 'text-gray-400 group-hover:text-gray-300'} mr-3 flex-shrink-0 h-6 w-6"
                />
                Contract Integration
              </div>

              <div
                on:click={() => {
                  page = 2;
                }}
                class="{page == 2
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'} cursor-pointer flex items-center px-2 py-2 text-base font-medium rounded-md"
              >
                <Cog
                  class="{page == 2
                    ? 'text-gray-300'
                    : 'text-gray-400 group-hover:text-gray-300'} mr-3 flex-shrink-0 h-6 w-6"
                />
                Configuration
              </div>
            </nav>
          </div>
        </div>

        <div class="w-14 flex-shrink-0">
          <!-- Force sidebar to shrink to fit close icon -->
        </div>
      </div>
    </div>
  {/if}

  <!-- Static sidebar for desktop -->
  <div class="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
    <!-- Sidebar component, swap this element with another sidebar if you like -->
    <div class="flex min-h-0 flex-1 flex-col bg-gray-800">
      <div class="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div class="flex flex-shrink-0 items-center px-4">
          <img
            class="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
          />
        </div>
        <nav class="mt-5 flex-1 space-y-1 px-2">
          <div
            on:click={() => {
              page = 0;
            }}
            class="{page == 0
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'} cursor-pointer group flex items-center px-2 py-2 text-sm font-medium rounded-md"
          >
            <ChartBar
              class="{page == 0
                ? 'text-gray-300'
                : 'text-gray-400 group-hover:text-gray-300'} mr-3 flex-shrink-0 h-6 w-6"
            />
            Dashboard
          </div>

          <div
            on:click={() => {
              page = 1;
            }}
            class="{page == 1
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'} cursor-pointer group flex items-center px-2 py-2 text-sm font-medium rounded-md"
          >
            <Code
              class="{page == 1
                ? 'text-gray-300'
                : 'text-gray-400 group-hover:text-gray-300'} mr-3 flex-shrink-0 h-6 w-6"
            />
            Contract Integration
          </div>

          <div
            on:click={() => {
              page = 2;
            }}
            class="{page == 2
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'} cursor-pointer group flex items-center px-2 py-2 text-sm font-medium rounded-md"
          >
            <Cog
              class="{page == 2
                ? 'text-gray-300'
                : 'text-gray-400 group-hover:text-gray-300'} mr-3 flex-shrink-0 h-6 w-6"
            />
            Configuration
          </div>
        </nav>
      </div>
    </div>
  </div>
  <div class="flex flex-1 flex-col md:pl-64">
    <div
      class="sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden"
    >
      <button
        on:click={() => {
          sidebarOpen = true;
        }}
        type="button"
        id="sidebar-toggle"
        class="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        <span class="sr-only">Open sidebar</span>
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
    <main class="flex-1">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <slot />
      </div>
    </main>
  </div>
</div>

<script>
  import { signerAddress, defaultEvmStores } from "svelte-ethers-store";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { disconnectWeb3Modal } from "$lib/js/auth";
  import CurrencyIcon from "./Components/CurrencyIcon.svelte";

  let navbarOpen = false;
  let profileMenuOpen = false;
  let visible = true;
  let last_scroll = 0;

  function handle_scroll() {
    const scroll = window.pageYOffset;
    visible = scroll < 50 || scroll < last_scroll;
    last_scroll = scroll;
  }

  $: currentPage = getPageNumber($page.routeId);

  function getPageNumber(routeId) {
    if (routeId == "my-contracts/[address]" || routeId == "my-contracts") {
      return 0;
    }

    if (routeId == "contact") {
      return 1;
    }

    if (routeId == "blog") {
      return 2;
    }

    return -1;
  }

  function clickOutside(element, callbackFunction) {
    let func = function onClick(event) {
      if (
        !element.contains(event.target) &&
        !document.getElementById("profile-button")?.contains(event.target)
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

<svelte:window on:scroll={handle_scroll} />

<header class:visible={visible || navbarOpen}>
  <nav class="bg-gray-800 w-[100vw] top-0 left-0">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between">
        <div class="flex">
          <div class="-ml-2 mr-2 flex items-center md:hidden">
            <!-- Mobile menu button -->
            <button
              on:click={() => (navbarOpen = !navbarOpen)}
              type="button"
              class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span class="sr-only">Open main menu</span>

              <svg
                class="{navbarOpen ? 'hidden' : 'block'} h-6 w-6"
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

              <svg
                class="{navbarOpen ? 'block' : 'hidden'} h-6 w-6"
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
          <div class="flex flex-shrink-0 items-center">
            <a href="/">
              <img
                class="block h-8 w-auto lg:hidden"
                src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=500"
                alt="Your Company"
              />
              <img
                class="hidden h-8 w-auto lg:block"
                src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=500"
                alt="Your Company"
              />
            </a>
          </div>
          <div class="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <a
              href="/my-contracts"
              class="{currentPage == 0
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'} px-3 py-2 rounded-md text-sm font-medium"
              aria-current="page">My Contracts</a
            >

            <a
              href="/contact"
              class="{currentPage == 1
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'} px-3 py-2 rounded-md text-sm font-medium"
              >Contact Us</a
            >

            <a
              href="/blog"
              class="{currentPage == 2
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'} px-3 py-2 rounded-md text-sm font-medium"
              >Blog</a
            >
          </div>
        </div>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <button
              on:click={() => {
                goto("/create");
                navbarOpen = false;
              }}
              type="button"
              class="relative inline-flex items-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span>New Contract</span>
            </button>
          </div>
          <div class="hidden md:ml-2 md:flex md:flex-shrink-0 md:items-center">
            <!-- <button
              type="button"
              class="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span class="sr-only">View notifications</span>
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
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
            </button> -->

            <!-- Profile dropdown -->
            {#if $signerAddress}
              <div id="profile-button" class="relative ml-3">
                <div>
                  <button
                    on:click={() => {
                      profileMenuOpen = !profileMenuOpen;
                    }}
                    type="button"
                    class="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span class="sr-only">Open user menu</span>
                    <img
                      class="h-8 w-8 rounded-full"
                      src="/BrendanPortTrait.png"
                      alt=""
                    />
                  </button>
                </div>

                {#if profileMenuOpen}
                  <!--
              Dropdown menu, show/hide based on menu state.

              Entering: "transition ease-out duration-200"
                From: "transform opacity-0 scale-95"
                To: "transform opacity-100 scale-100"
              Leaving: "transition ease-in duration-75"
                From: "transform opacity-100 scale-100"
                To: "transform opacity-0 scale-95"
            -->
                  <div
                    use:clickOutside={() => {
                      profileMenuOpen = false;
                    }}
                    class="divide-y absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabindex="-1"
                  >
                    <div
                      class="rounded-t-md flex items-center h-[37px] gap-2 px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabindex="-1"
                      id="user-menu-item-1"
                    >
                      <div class="text-gray-500 truncate">{$signerAddress}</div>
                      <CurrencyIcon size="40" />
                    </div>

                    <div
                      on:click={() => {
                        disconnectWeb3Modal();
                        navbarOpen = false;
                      }}
                      class="cursor-pointer hover:bg-gray-100 hover:rounded-b-md block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabindex="-1"
                      id="user-menu-item-2"
                    >
                      Sign out
                    </div>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>

    {#if navbarOpen}
      <!-- Mobile menu, show/hide based on menu state. -->
      <div class="md:hidden" id="mobile-menu">
        <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          <a
            on:click={() => {
              navbarOpen = false;
            }}
            href="/my-contracts"
            class="{currentPage == 0
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'} block px-3 py-2 rounded-md text-base font-medium"
            aria-current="page">My Contracts</a
          >

          <a
            on:click={() => {
              navbarOpen = false;
            }}
            href="/contact"
            class="{currentPage == 1
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'} block px-3 py-2 rounded-md text-base font-medium"
            >Contact Us</a
          >

          <a
            on:click={() => {
              navbarOpen = false;
            }}
            href="/blog"
            class="{currentPage == 2
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'} block px-3 py-2 rounded-md text-base font-medium"
            >Blog</a
          >
        </div>

        {#if $signerAddress}
          <div class="border-t border-gray-700 pt-4 pb-3">
            <div class="flex items-center px-5 sm:px-6">
              <div class="flex-shrink-0">
                <img
                  class="h-10 w-10 rounded-full"
                  src="/BrendanPortTrait.png"
                  alt=""
                />
              </div>
              <div class="ml-3 max-w-[85%] flex gap-4">
                <div class="text-base truncate font-medium text-gray-400">
                  {$signerAddress}
                </div>
                <CurrencyIcon />
              </div>
              <!-- <button
              type="button"
              class="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span class="sr-only">View notifications</span>
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
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
            </button> -->
            </div>
            <div class="mt-3 space-y-1 px-2 sm:px-3">
              <div
                on:click={() => {
                  disconnectWeb3Modal();
                  navbarOpen = false;
                }}
                class="cursor-pointer block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                Sign out
              </div>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </nav>
</header>

<style>
  header {
    position: fixed;
    z-index: 11;
    width: 100vw;
    transform: translate(0, calc(-100% - 1rem));
    transition: transform 0.2s;
  }

  header.visible {
    transform: none;
  }

  nav {
    transform: none;
    transition: none;
  }
</style>

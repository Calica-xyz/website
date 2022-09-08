<script>
  import { signerAddress } from "svelte-ethers-store";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  let navbarOpen = false;
  let profileMenuOpen = false;

  $: currentPage = getPageNumber($page.routeId);

  function getPageNumber(routeId) {
    if (routeId == "my-contracts/[address]") {
      return 0;
    }

    return -1;
  }
</script>

<nav class="bg-gray-800 z-10">
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
          <img
            class="block h-8 w-auto lg:hidden"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
          />
          <img
            class="hidden h-8 w-auto lg:block"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
          />
        </div>
        <div class="hidden md:ml-6 md:flex md:items-center md:space-x-4">
          <a
            href={`/my-contracts/${$signerAddress}`}
            class="{currentPage == 0
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'} px-3 py-2 rounded-md text-sm font-medium"
            aria-current="page">My Contracts</a
          >

          <a
            href="#"
            class="{currentPage == 1
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'} px-3 py-2 rounded-md text-sm font-medium"
            >Contact Us</a
          >

          <a
            href="#"
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
            }}
            type="button"
            class="relative inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span>New Contract</span>
          </button>
        </div>
        <div class="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
          <button
            type="button"
            class="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span class="sr-only">View notifications</span>
            <!-- Heroicon name: outline/bell -->
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
          </button>

          <!-- Profile dropdown -->
          <div class="relative ml-3">
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
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabindex="-1"
              >
                <!-- Active: "bg-gray-100", Not Active: "" -->
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                  tabindex="-1"
                  id="user-menu-item-1">Settings</a
                >

                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                  tabindex="-1"
                  id="user-menu-item-2">Sign out</a
                >
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>

  {#if navbarOpen}
    <!-- Mobile menu, show/hide based on menu state. -->
    <div class="md:hidden" id="mobile-menu">
      <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
        <a
          href={`/my-contracts/${$signerAddress}`}
          class="{currentPage == 0
            ? 'bg-gray-900 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'} block px-3 py-2 rounded-md text-base font-medium"
          aria-current="page">My Contracts</a
        >

        <a
          href="#"
          class="{currentPage == 1
            ? 'bg-gray-900 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'} block px-3 py-2 rounded-md text-base font-medium"
          >Contract Integration</a
        >

        <a
          href="#"
          class="{currentPage == 2
            ? 'bg-gray-900 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'} block px-3 py-2 rounded-md text-base font-medium"
          >Configuration</a
        >
      </div>
      <div class="border-t border-gray-700 pt-4 pb-3">
        <div class="flex items-center px-5 sm:px-6">
          <div class="flex-shrink-0">
            <img
              class="h-10 w-10 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-white">Tim Cook</div>
            <div class="text-sm font-medium text-gray-400">tim@apple.com</div>
          </div>
          <button
            type="button"
            class="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span class="sr-only">View notifications</span>
            <!-- Heroicon name: outline/bell -->
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
          </button>
        </div>
        <div class="mt-3 space-y-1 px-2 sm:px-3">
          <a
            href="#"
            class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
            >Settings</a
          >

          <a
            href="#"
            class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
            >Sign out</a
          >
        </div>
      </div>
    </div>
  {/if}
</nav>
<!-- 
<Navbar let:hidden let:toggle class="m-8 rounded-lg shadow p-4">
  <NavBrand href="/">
    <h5 class="text-gray-600 self-center whitespace-nowrap dark:text-white p-2">
      Calica
    </h5>
  </NavBrand>
  <NavHamburger on:click={toggle} />
  <NavUl {hidden}>
    <NavLi {nonActiveClass} href="/create">Create Contract</NavLi>
    <NavLi {nonActiveClass} href={`/my-contracts/${$signerAddress}`}
      >My Contracts</NavLi
    >
  </NavUl>
</Navbar> -->

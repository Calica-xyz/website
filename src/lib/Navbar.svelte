<script>
  import {
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
  } from "flowbite-svelte";

  let nonActiveClass =
    "block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700";
</script>

<Navbar let:hidden let:toggle class="m-8 rounded-lg shadow p-4">
  <NavBrand href="/">
    <h5 class="text-gray-600 self-center whitespace-nowrap dark:text-white p-2">
      Calica
    </h5>
  </NavBrand>
  <NavHamburger on:click={toggle} />
  <NavUl {hidden}>
    <NavLi {nonActiveClass} href="/create">Create Contract</NavLi>
    <NavLi
      {nonActiveClass}
      href="/my-contracts/0x99BB44964caEb93bC862a60b89173b934d99bAE7"
      >My Contracts</NavLi
    >
  </NavUl>
</Navbar>

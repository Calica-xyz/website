<script>
    import {
        Navbar,
        NavBrand,
        NavLi,
        NavUl,
        NavHamburger,
    } from "flowbite-svelte";
</script>

<Navbar let:hidden let:toggle class="m-8 rounded-lg shadow p-4">
    <NavBrand href="/">
        <h5 class="self-center whitespace-nowrap dark:text-white p-2">
            Calica
        </h5>
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden}>
        <NavLi href="/">My Contracts</NavLi>
    </NavUl>
</Navbar>

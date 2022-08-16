<script>
    import {
        Footer,
        FooterBrand,
        FooterCopyright,
        FooterIcon,
        FooterLink,
        FooterLinkGroup,
    } from "flowbite-svelte";
</script>

<Footer class="m-8" footerType="logo">
    <div class="sm:flex sm:items-center sm:justify-between">
        <h5 class="mb-2 sm:mb-0">Calica</h5>
        <FooterLinkGroup
            ulClass="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400"
        >
            <FooterLink href="https://calica.xyz">Home Page</FooterLink>
            <FooterLink href="https://calica.xyz/blogs">Our Blog</FooterLink>
            <FooterLink href="https://calica.xyz/contact">Contact Us</FooterLink
            >
        </FooterLinkGroup>
    </div>
    <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-6" />
    <FooterCopyright href="/" by="Calica Inc" />
</Footer>

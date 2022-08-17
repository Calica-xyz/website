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

<Footer class="m-8">
    <FooterCopyright href="/" by="Calica Inc" />
    <FooterLinkGroup
        ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0"
    >
        <FooterLink href="https://calica.xyz">Home Page</FooterLink>
        <FooterLink href="https://calica.xyz/blogs">Our Blog</FooterLink>
        <FooterLink href="https://calica.xyz/contact">Contact Us</FooterLink>
    </FooterLinkGroup>
</Footer>

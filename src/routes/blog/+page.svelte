<script lang="ts">
  import BlogArticle from "./BlogArticle.svelte";
</script>

<svelte:head>
  <title>Our Blog</title>
  <meta charset="utf-8" />
</svelte:head>

<div class="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-20 lg:pb-28">
  <div class="absolute inset-0">
    <div class="h-1/3 bg-white sm:h-2/3" />
  </div>
  <div class="relative mx-auto max-w-5xl">
    <div class="text-center">
      <h2 class="text-3xl font-bold tracking-tight text-gray-700 sm:text-4xl">
        From the blog
      </h2>
      <p class="mx-auto mt-3 max-w-2xl text-lg text-gray-500 sm:mt-4">
        All the things we're talking about
      </p>
    </div>
    <div
      class="mt-12 gap-12 grid place-items-center items-stretch"
      style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));"
    >
      <BlogArticle
        title="Announcing Calica"
        img="https://miro.medium.com/max/1094/1*K6X5a0dESF3mGkOhSRx3EA.png"
        text="With Calica, people will be able to write a smart contract, find consensus with counter parties on a fair arrangement, and deploy the smart contract to automatically execute on chain."
        link="https://medium.com/@silver0601/announcing-calica-428ab28463b"
        author="Adam"
        date="Jul 20, 2022"
        readTime="3 min"
      />
      <BlogArticle
        title="Calica + Floor’s Partnership"
        img="https://miro.medium.com/max/1094/0*W6tiLOFfo-GWvkv9"
        text="We want Calica to enable anyone to automate their business arrangements and earnings using smart contracts. Together, Floor and Calica can impact both on-chain projects and collectors."
        link="https://medium.com/@silver0601/why-calica-is-working-with-floor-a9685b743e89"
        author="Adam"
        date="Aug 12, 2022"
        readTime="2 min"
      />
    </div>
  </div>
</div>

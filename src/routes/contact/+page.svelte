<script lang="ts">
  import Button from "$lib/Flowbite/Button.svelte";
  import { page } from "$app/stores";
  import { fade } from "svelte/transition";
  import { Alert } from "flowbite-svelte";
  import { CheckCircle } from "svelte-heros";

  $: redirect = $page.url.searchParams.get("success") == "true";
</script>

<svelte:head>
  <title>Contact Us</title>
  <meta charset="utf-8" />
</svelte:head>

<div class="relative bg-white">
  <div class="absolute inset-0">
    <div
      class="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-b from-tertiary-50 to-white"
    />
  </div>
  <div class="relative mx-auto max-w-7xl lg:grid lg:grid-cols-5">
    <div
      class="bg-gradient-to-b from-tertiary-50 to-white py-16 px-4 sm:px-6 lg:col-span-2 lg:px-8 lg:py-24 xl:pr-12"
    >
      <div class="mx-auto max-w-lg">
        <h2 class="text-2xl font-bold tracking-tight text-gray-700 sm:text-3xl">
          Let's work together
        </h2>
        <p class="mt-3 leading-6 text-sm text-gray-500">
          Whether you're a developer, business owner, or just want to chat, we'd
          love to hear from you.
        </p>
        <dl class="mt-8 text-base text-gray-500">
          <div>
            <dt class="sr-only">Location</dt>
            <dd>
              <p>
                We're based in <span class="underline">San Francisco, CA</span>
              </p>
            </dd>
          </div>
          <div class="mt-10">
            <dt class="sr-only">Email</dt>
            <dd class="flex">
              <!-- Heroicon name: outline/envelope -->
              <svg
                class="h-6 w-6 flex-shrink-0 text-gray-400"
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
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              <span class="ml-3">support@calica.xyz</span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <div
      class="bg-white py-16 px-4 sm:px-6 lg:col-span-3 lg:py-24 lg:px-8 xl:pl-12"
    >
      <div class="mx-auto max-w-lg lg:max-w-none">
        <form
          action="https://api.web3forms.com/submit"
          method="POST"
          class="grid grid-cols-1 gap-y-6"
        >
          <input
            type="hidden"
            name="redirect"
            value={$page.url.href + "?success=true"}
          />

          <input
            type="checkbox"
            name="botcheck"
            class="hidden"
            style="display: none;"
          />

          <input
            type="hidden"
            name="access_key"
            value="0f5df382-1ffa-4bc3-9e27-1a14fc954754"
          />
          <div>
            <label for="full-name" class="sr-only">Full name</label>
            <input
              type="text"
              name="full-name"
              id="full-name"
              autocomplete="name"
              class="block w-full rounded-md border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Full name"
            />
          </div>
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="text"
              autocomplete="email"
              class="block w-full rounded-md border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Email"
            />
          </div>
          <div>
            <label for="message" class="sr-only">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              class="block w-full rounded-md border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Message"
            />
          </div>
          <div class="flex gap-8">
            <Button class="bg-primary-300" type="submit">Submit</Button>
            {#if redirect}
              <div in:fade>
                <Alert class="p-2 mb-0  w-[120px]" color="green"
                  ><span class="mr-1"><CheckCircle size="20" /></span
                  >Success</Alert
                >
              </div>
            {/if}
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

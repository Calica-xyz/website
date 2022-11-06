<script lang="ts">
  import { page } from "$app/stores";
  import Button from "$lib/Flowbite/Button.svelte";
  import { slide } from "svelte/transition";
  import {
    ArrowCircleRight,
    ArrowNarrowRight,
    CheckCircle,
  } from "svelte-heros";
  import { chainId } from "svelte-ethers-store";
  import { getChainFromId } from "$lib/js/utils";
  import { signer } from "svelte-ethers-store";
  import { ethers } from "ethers";

  let oceanAddress = $page.url.searchParams.get("oceanAddress") as string;
  let calicaAddress = $page.url.searchParams.get("calicaAddress") as string;
  let contractType = $page.url.searchParams.get("contractType") as string;

  let chain = getChainFromId($chainId as number);
  let link = `/${chain}/${calicaAddress}?type=${contractType}`;
  let linkedContracts = false;

  function launchConfetti() {
    for (let i = 0; i < 150; i++) {
      create(i);
    }
  }

  async function setPaymentCollector() {
    let abi =
      '[{"inputs":[{"internalType":"address","name":"_newPaymentCollector","type":"address"}],"name":"setPaymentCollector","outputs":[],"stateMutability":"nonpayable","type":"function"}]';

    let contract = new ethers.Contract(oceanAddress, abi, $signer);

    let res = await contract.setPaymentCollector(calicaAddress);
    await res.wait();

    launchConfetti();
    linkedContracts = true;
  }

  function create(i: number) {
    var width = Math.random() * 8;
    var height = width * 0.4;
    var colourIdx = Math.ceil(Math.random() * 3);
    var colour = "red";
    switch (colourIdx) {
      case 1:
        colour = "yellow";
        break;
      case 2:
        colour = "blue";
        break;
      default:
        colour = "red";
    }

    window
      // @ts-ignore
      .$('<div class="confetti-' + i + " " + colour + '"></div>')
      .css({
        width: width + "px",
        height: height + "px",
        top: -Math.random() * 20 + "%",
        left: Math.random() * 100 + "%",
        opacity: Math.random() + 0.5,
        transform: "rotate(" + Math.random() * 360 + "deg)",
      })
      .appendTo(".wrapper");

    drop(i);
  }

  function drop(x: number) {
    // @ts-ignore
    window.$(".confetti-" + x).animate(
      {
        top: "100%",
        left: "+=" + Math.random() * 15 + "%",
      },
      Math.random() * 2000 + 2000,
      function () {
        reset(x);
      }
    );
  }

  function reset(x: number) {
    // @ts-ignore
    window.$(".confetti-" + x).animate(
      {
        top: -Math.random() * 20 + "%",
        left: "-=" + Math.random() * 15 + "%",
      },
      0,
      function () {
        drop(x);
      }
    );
  }
</script>

<div class="wrapper absolute" />

<div in:slide={{ duration: 500 }} class="max-w-4xl px-4 mx-auto sm:px-12 my-14">
  <div class="flex gap-x-8 gap-y-2 items-center flex-row flex-wrap">
    <CheckCircle class="text-green-500" size="45" />
    <div class="min-w-[250px]">
      <h4 class="text-gray-700">Woohoo! Your Calica contract was deployed.</h4>
      <p class="text-gray-600">
        It will now show up in the <a class="hover:underline" href="/"
          >My Contracts</a
        > page
      </p>
    </div>
  </div>

  <div class="mt-10 flex gap-x-8 gap-y-2 items-center flex-row flex-wrap">
    {#if linkedContracts}
      <CheckCircle class="text-green-500" size="45" />
    {:else}
      <ArrowCircleRight class="text-gray-400" size="45" />
    {/if}
    <div class="min-w-[250px]">
      <h4 class="text-gray-700">
        Next, you'll need to connect your Ocean Contract
      </h4>
      <p class="text-gray-600">
        This will trigger a transaction to change your payout address
      </p>

      {#if !linkedContracts}
        <Button class="mt-4" on:click={setPaymentCollector}
          >Link Ocean Contract</Button
        >
      {/if}
    </div>
  </div>

  {#if linkedContracts}
    <a href={link}>
      <Button class="mt-8" color="primary">
        Go to Calica dashboard <ArrowNarrowRight class="ml-2" size="20" />
      </Button>
    </a>
  {/if}
</div>

<style>
  :global([class|="confetti"]) {
    position: absolute;
  }

  .wrapper {
    overflow: hidden;
    z-index: -1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  :global(.red) {
    background-color: #d13447;
  }

  :global(.yellow) {
    background-color: #ffbf00;
  }

  :global(.blue) {
    background-color: #263672;
  }
</style>

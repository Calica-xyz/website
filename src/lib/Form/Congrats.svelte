<script lang="ts">
  import Button from "$lib/Flowbite/Button.svelte";
  import { slide } from "svelte/transition";
  import js from "jquery";
  import { onMount } from "svelte";
  import { ArrowNarrowRight } from "svelte-heros";

  export let deployAddress;
  export let pagesState;

  onMount(() => {
    for (let i = 0; i < 150; i++) {
      create(i);
    }
  });

  function create(i) {
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

    js('<div class="confetti-' + i + " " + colour + '"></div>')
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

  function drop(x) {
    js(".confetti-" + x).animate(
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

  function reset(x) {
    js(".confetti-" + x).animate(
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

  let link = `/${"maticmum"}/${deployAddress}?type=${pagesState[0].type}`;
</script>

<div class="wrapper absolute" />

<div in:slide={{ duration: 500 }} class="max-w-4xl mx-auto sm:px-12 my-14">
  <div class="">
    <h2 class="text-gray-700">Woohoo! Your contract was deployed 🎉</h2>
    <h5 class="text-gray-600">
      It will now show up in the <a class="hover:underline" href="/"
        >My Contracts</a
      > page
    </h5>
    <a href={link}>
      <Button class="mt-8" color="primary">
        Go to contract dashboard <ArrowNarrowRight class="ml-2" size="20" />
      </Button>
    </a>
  </div>
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

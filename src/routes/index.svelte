<script lang="ts">
  import Icon from "svelte-awesome";
  import arrowRight from "svelte-awesome/icons/arrowRight";
  import { onMount } from "svelte";
  import { browser } from "$app/env";
  import Chart from "chart.js/auto";
  import { BigNumber, ethers } from "ethers";

  const provider = new ethers.providers.JsonRpcProvider();
  const signer = provider.getSigner();

  let chrisBalance = "",
    nikBalance = "",
    adamBalance = "";

  async function setBalance() {
    let nikHexBalance = await provider.getBalance(
      "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
    );
    nikBalance = ethers.utils.formatEther(nikHexBalance);

    let chrisHexBalance = await provider.getBalance(
      "0xdD2FD4581271e230360230F9337D5c0430Bf44C0"
    );
    chrisBalance = ethers.utils.formatEther(chrisHexBalance);

    let adamHexBalance = await provider.getBalance(
      "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E"
    );
    adamBalance = ethers.utils.formatEther(adamHexBalance);
  }

  let firstSplit: HTMLCanvasElement,
    secondSplit: HTMLCanvasElement,
    thirdSplit: HTMLCanvasElement;

  let firstSplitData = {
    labels: ["Chris"],
    datasets: [
      {
        data: [100],
        backgroundColor: ["#46BFBD"],
        hoverBackgroundColor: ["#5AD3D1"],
      },
    ],
  };

  let secondSplitData = {
    labels: ["Adam", "Chris", "Nik"],
    datasets: [
      {
        data: [10, 80, 10],
        backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C"],
        hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870"],
      },
    ],
  };

  let thirdSplitData = {
    labels: ["Adam", "Chris", "Nik"],
    datasets: [
      {
        data: [33, 33, 33],
        backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C"],
        hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870"],
      },
    ],
  };

  onMount(() => {
    setBalance();
    if (browser) {
      new Chart(firstSplit, {
        type: "doughnut",
        data: firstSplitData,
      });

      new Chart(secondSplit, {
        type: "doughnut",
        data: secondSplitData,
      });

      new Chart(thirdSplit, {
        type: "doughnut",
        data: thirdSplitData,
      });
    }
  });
</script>

<div class="m-8">
  <h1 class="my-10">Capped Revenue Agreement Terms</h1>
  <ol class="items-center sm:flex">
    <li class="relative mb-6 sm:mb-0">
      <div class="flex items-center">
        <div
          class="hidden my-[12px] sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"
        />
      </div>
      <div class="mt-3 sm:pr-8">
        <h3>No cap</h3>
        <canvas bind:this={firstSplit} />
      </div>
    </li>
    <li class="relative mb-6 sm:mb-0">
      <div class="flex items-center">
        <div
          class="flex z-10 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0"
        >
          <Icon
            class="w-3 h-3 text-blue-600 dark:text-blue-300"
            data={arrowRight}
          />
        </div>
        <div class="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700" />
      </div>
      <div class="mt-3 sm:pr-8">
        <h3>100 ETH Cap</h3>
        <canvas bind:this={secondSplit} />
      </div>
    </li>
    <li class="relative mb-6 sm:mb-0">
      <div class="flex items-center">
        <div
          class="flex z-10 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0"
        >
          <Icon
            class="w-3 h-3 text-blue-600 dark:text-blue-300"
            data={arrowRight}
          />
        </div>
        <div class="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700" />
      </div>
      <div class="mt-3 sm:pr-8">
        <h3>200 ETH Cap</h3>
        <canvas bind:this={thirdSplit} />
      </div>
    </li>
  </ol>
</div>

<div class="m-8">
  <h1>Account Balances</h1>
  <div class="">
    <div class="">
      <h2>Chris</h2>
      <h3>Balance: {chrisBalance}</h3>
    </div>
    <div class="">
      <h2>Adam</h2>
      <h3>Balance: {adamBalance}</h3>
    </div>
    <div class="">
      <h2>Nik</h2>
      <h3>Balance: {nikBalance}</h3>
    </div>
  </div>
  <button on:click={() => setBalance()}> Refresh Balances </button>
</div>

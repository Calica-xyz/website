<script>
  import SimpleRevShare from "$lib/Dashboard/SimpleRevShare.svelte";
  import CappedRevShare from "$lib/Dashboard/CappedRevShare.svelte";
  import TotalPaid from "$lib/Dashboard/TotalPaid.svelte";
  import StakeholderList from "$lib/Dashboard/StakeholderList.svelte";
  import Payouts from "$lib/Dashboard/Payouts.svelte";
  import ChainBadge from "$lib/Components/ChainBadge.svelte";

  import { signerAddress } from "svelte-ethers-store";
  import { page } from "$app/stores";

  export let ownerAddress;
  export let contractName;
  export let contractType;
  export let deployDateString;
  export let chartData;
  export let withdrawalHistory;
  export let addressMappings;

  let isOwner = $signerAddress == ownerAddress;
  let currency = getCurrency();
  let chain = $page.params.chain;

  let primaryColor =
    chain == "maticmum" || chain == "matic" ? "#8247e5" : "#3c3c3d";

  function getCurrency() {
    if ($page.params.chain == "maticmum" || $page.params.chain == "matic") {
      return "MATIC";
    } else if (
      $page.params.chain == "goerli" ||
      $page.params.chain == "homestead"
    ) {
      return "ETH";
    } else return "";
  }

  function getTotalAmountPaid() {
    let totalPaid = 0;

    for (let i = 0; i < withdrawalHistory.length; i++) {
      if (isOwner || $signerAddress == withdrawalHistory[i].account) {
        totalPaid += withdrawalHistory[i].amount;
      }
    }

    return totalPaid;
  }

  function getStakeholderListData() {
    let stakeholderMap = {
      Owner: {
        amountPaid: 0,
        address: ownerAddress,
      },
    };

    for (let [key, value] of Object.entries(addressMappings)) {
      if (isOwner || $signerAddress == key) {
        stakeholderMap[value] = {
          amountPaid: 0,
          address: key,
        };
      }
    }

    for (let i = 0; i < withdrawalHistory.length; i++) {
      let addr = withdrawalHistory[i].account;
      let amount = withdrawalHistory[i].amount;
      let name = addressMappings[addr];

      if (isOwner || $signerAddress == addr) {
        stakeholderMap[name] = {
          amountPaid: stakeholderMap[name].amountPaid + amount,
          address: addr,
        };
      } else {
        stakeholderMap["Owner"].amountPaid += amount;
      }
    }

    let stakeholderList = [];

    for (let [key, value] of Object.entries(stakeholderMap)) {
      stakeholderList.push({
        name: key,
        address: value.address,
        amountPaid: precisionRoundMod(value.amountPaid),
      });
    }

    stakeholderList.sort(function (a, b) {
      if (a.address == $signerAddress) return -1;
      if (b.address == $signerAddress) return 1;

      return a.amountPaid - b.amountPaid;
    });

    return stakeholderList;
  }

  function precisionRoundMod(number) {
    var factor = Math.pow(10, 12);
    return Math.round(number * factor) / factor;
  }

  function getPayoutHistory() {
    let payoutHistoryMap = {};
    let payoutHistory = [];

    for (let i = 0; i < withdrawalHistory.length; i++) {
      let amount = withdrawalHistory[i].amount;
      let timestamp = withdrawalHistory[i].timestamp;

      if (isOwner || $signerAddress == withdrawalHistory[i].account) {
        payoutHistoryMap[timestamp] =
          timestamp in payoutHistoryMap
            ? payoutHistoryMap[timestamp] + amount
            : amount;
      }
    }

    for (let [timestamp, amount] of Object.entries(payoutHistoryMap)) {
      payoutHistory.push({
        x: timestamp,
        y: amount,
      });
    }

    return payoutHistory;
  }
</script>

<div class="flex w-full justify-center">
  <div
    class="flex-1 sm:my-10"
    style="max-width: min(1400px, calc(100% - 4rem));"
  >
    <div
      class="flex flex-wrap justify-between gap-x-16 gap-y-8 items-center mb-8"
    >
      <div class="flex-1 flex flex-wrap gap-x-6 m-w-[600px] m-auto">
        <h1 class="text-gray-600">{contractName}</h1>
        <div class="flex flex-col gap-2 justify-center">
          <p class="text-gray-500 subtitle-text">
            Deployed {deployDateString}
          </p>
          <ChainBadge class="self-start" chain={$page.params.chain} />
        </div>
      </div>

      <div
        class="flex-1 flex flex-wrap gap-x-8 gap-y-8 justify-between"
        style="min-width: min(650px, 100%)"
      >
        <TotalPaid
          class="flex-auto min-w-[180px]"
          amount={getTotalAmountPaid()}
          {currency}
        />
        <StakeholderList
          class="flex-auto"
          {primaryColor}
          data={getStakeholderListData()}
        />
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-x-8 gap-y-8">
      {#if contractType === "SimpleRevenueShare"}
        <SimpleRevShare class="flex-1" data={chartData} />
      {:else if contractType === "CappedRevenueShare"}
        <CappedRevShare class="flex-1" data={chartData} />
      {/if}

      <Payouts class="flex-1" data={getPayoutHistory()} {currency} />
    </div>
  </div>
</div>

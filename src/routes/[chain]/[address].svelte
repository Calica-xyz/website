<script lang="ts">
  import SimpleRevShare from "$lib/Dashboard/SimpleRevShare.svelte";
  import CappedRevShare from "$lib/Dashboard/CappedRevShare.svelte";
  import TotalPaid from "$lib/Dashboard/TotalPaid.svelte";
  import StakeholderList from "$lib/Dashboard/StakeholderList.svelte";
  import Payouts from "$lib/Dashboard/Payouts.svelte";
  import ChainBadge from "$lib/Components/ChainBadge.svelte";
  import Popover from "$lib/Flowbite/Popover.svelte";

  import { signerAddress } from "svelte-ethers-store";
  import { page } from "$app/stores";
  import { getCurrency, roundNumber } from "$lib/js/utils";
  import moment from "moment";

  export let ownerAddress: string;
  export let contractName: string;
  export let contractType: string;
  export let deployDate: number;
  export let splits: any;
  export let withdrawalHistory: any;
  export let addressMappings: any;

  $: relativeDeployDate = moment.unix(deployDate).fromNow();
  $: formattedDeployDate = moment
    .unix(deployDate)
    .format("MMM Do YYYY, h:mm a");
  $: isOwner = $signerAddress == ownerAddress;
  $: currency = getCurrency($page.params.chain);

  function getDoughnutChartData() {
    splits = splits.filter(function (split: any) {
      if (isOwner || split.account == $signerAddress) return true;
      if (!isOwner && split.account == ownerAddress) return true;
    });

    if (splits.length == 1 && !isOwner) {
      splits.push({
        name: "Owner",
        account: ownerAddress,
        percentage: 100 - splits[0].percentage,
      });
    }

    return {
      labels: splits.map((split: any) => split.name),
      splits: splits.map((split: any) => split.percentage),
    };
  }

  function getTotalAmountPaid() {
    let totalPaid = 0;

    for (let i = 0; i < withdrawalHistory.length; i++) {
      if (isOwner || $signerAddress == withdrawalHistory[i].account) {
        totalPaid += withdrawalHistory[i].amount;
      }
    }

    return roundNumber(totalPaid);
  }

  function getStakeholderListData() {
    let stakeholderMap = {
      Owner: {
        amountPaid: 0,
        address: ownerAddress,
      },
    };

    let ownerName = "Owner";

    for (let [key, value] of Object.entries(addressMappings)) {
      if (isOwner || $signerAddress == key) {
        stakeholderMap[value] = {
          amountPaid: 0,
          address: key,
        };
      }

      if (ownerAddress == key) {
        ownerName = value;
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

    stakeholderMap[ownerName] = {
      amountPaid: stakeholderMap["Owner"].amountPaid,
      address: stakeholderMap["Owner"].address,
    };

    if (ownerName != "Owner") delete stakeholderMap.Owner;

    let stakeholderList = [];

    for (let [key, value] of Object.entries(stakeholderMap)) {
      stakeholderList.push({
        name: key,
        address: value.address,
        amountPaid: roundNumber(value.amountPaid),
      });
    }

    stakeholderList.sort(function (a, b) {
      if (a.address == $signerAddress) return -1;
      if (b.address == $signerAddress) return 1;

      return a.amountPaid - b.amountPaid;
    });

    return stakeholderList;
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

  function getChartFlexWrapClass() {
    switch (splits.length) {
      case 1:
        return "md:flex-nowrap";
      case 2:
        return "lg:flex-nowrap";
      default:
        return "";
    }
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
      <div class="flex-1 flex flex-wrap gap-x-6 min-w-[240px] m-auto">
        <h1 class="text-gray-600 leading-tight">{contractName}</h1>
        <div class="flex flex-col gap-2 justify-center">
          <Popover placement="right" class="max-w-[128px] text-sm font-light ">
            <p slot="trigger" class="text-gray-500 subtitle-text">
              Deployed {relativeDeployDate}
            </p>
            {formattedDeployDate}
          </Popover>
          <ChainBadge class="self-start" chain={$page.params.chain} />
        </div>
      </div>

      <div
        class="flex-1 flex flex-wrap gap-x-8 gap-y-8 justify-between"
        style="min-width: min(650px, 100%)"
      >
        <TotalPaid
          {isOwner}
          class="flex-auto min-w-[180px]"
          amount={getTotalAmountPaid()}
          {currency}
        />
        <StakeholderList
          class="flex-auto"
          data={getStakeholderListData()}
          {isOwner}
        />
      </div>
    </div>

    <div
      class="flex flex-wrap {getChartFlexWrapClass()} justify-center gap-x-8 gap-y-8"
    >
      {#if contractType === "simple"}
        <SimpleRevShare class="flex-1" data={getDoughnutChartData()} />
      {:else if contractType === "capped"}
        <!-- <CappedRevShare
        chain={$page.params.chain}
        class="flex-1 {getAgreementChartBasisClass()}"
        data={getDoughnutChartData()}
      /> -->
      {/if}

      <Payouts class="flex-1" data={getPayoutHistory()} {currency} />
    </div>
  </div>
</div>

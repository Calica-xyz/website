<script lang="ts">
  import SimpleRevShare from "$lib/Dashboard/SimpleRevShare.svelte";
  import CappedRevShare from "$lib/Dashboard/CappedRevShare.svelte";
  import TotalPaid from "$lib/Dashboard/TotalPaid.svelte";
  import StakeholderList from "$lib/Dashboard/StakeholderList.svelte";
  import Payouts from "$lib/Dashboard/Payouts.svelte";
  import Earnings from "$lib/Dashboard/Earnings.svelte";
  import ChainBadge from "$lib/Components/ChainBadge.svelte";
  import Popover from "$lib/Flowbite/Popover.svelte";

  import { signerAddress } from "svelte-ethers-store";
  import { page } from "$app/stores";
  import { getCurrency, roundNumber } from "$lib/js/utils";
  import moment from "moment";
  import CopyButton from "$lib/Components/CopyButton.svelte";

  export let ownerAddress: string;
  export let contractName: string;
  export let contractType: string;
  export let deployDate: number;
  export let splits: any;
  export let cappedSplits: any;
  export let withdrawalHistory: any;
  export let addressMappings: any;

  $: relativeDeployDate = moment.unix(deployDate).fromNow();
  $: formattedDeployDate = moment
    .unix(deployDate)
    .format("MMM Do YYYY, h:mm a");
  $: isOwner = $signerAddress == ownerAddress;
  $: currency = getCurrency($page.params.chain);

  function getDoughnutChartData(splits) {
    splits = splits.filter(function (split: any) {
      if (isOwner || split.account == $signerAddress) return true;
    });

    if (splits.length == 0) {
      splits.push({
        name: "",
        account: "",
        percentage: 100,
      });
    }

    if (splits.length == 1 && !isOwner) {
      splits.push({
        name: "",
        account: "",
        percentage: 100 - splits[0].percentage,
      });
    }

    return {
      labels: splits.map((split: any) => split.name),
      splits: splits.map((split: any) => split.percentage),
    };
  }

  function getCappedChartData(cappedSplits) {
    return cappedSplits.map(function (cappedSplit: any) {
      return {
        cap: cappedSplit.cap,
        splits: getDoughnutChartData(cappedSplit.splits),
      };
    });
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
    let stakeholderList = [];

    for (let [key, value] of Object.entries(addressMappings)) {
      stakeholderList.push({
        name: value,
        address: key,
      });
    }
    if (
      !stakeholderList.some(
        (stakeholder: any) => stakeholder.address == ownerAddress
      )
    ) {
      stakeholderList.push({
        name: "Owner",
        address: ownerAddress,
      });
    }

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
        y: roundNumber(amount),
      });
    }

    return payoutHistory;
  }

  function getCumulativeEarningsData() {
    let datasets = [];
    let data = {
      datasets,
    };

    let accountMap = {};

    for (let i = 0; i < withdrawalHistory.length; i++) {
      let account = withdrawalHistory[i].account;

      if (isOwner || $signerAddress == account) {
        if (account in accountMap) {
          let previousAmount =
            accountMap[account][accountMap[account].length - 1].y;

          accountMap[account].push({
            x: withdrawalHistory[i].timestamp,
            y: previousAmount + withdrawalHistory[i].amount,
          });
        } else {
          accountMap[account] = [
            {
              x: withdrawalHistory[i].timestamp,
              y: withdrawalHistory[i].amount,
            },
          ];
        }
      }
    }

    for (let [key, value] of Object.entries(accountMap)) {
      datasets.push({
        label: addressMappings[key],
        data: value,
      });
    }

    return data;
  }

  function getChartFlexWrapClass() {
    if (splits.length == 1) return "md:flex-nowrap";
    if (splits.length == 2) return "lg:flex-nowrap";
    if (splits.length >= 3) return "";

    return "";
  }

  function getAgreementChartBasisClass() {
    if (splits.length == 1) return "";
    if (splits.length == 2) return "basis-2/3";
    if (splits.length >= 3) return "basis-full";

    return "";
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
        <div class="flex flex-col justify-center">
          <Popover placement="right" class="max-w-[128px] text-sm font-light ">
            <p slot="trigger" class="py-2 text-gray-500 subtitle-text">
              Deployed {relativeDeployDate}
            </p>
            {formattedDeployDate}
          </Popover>
          <div class="flex flex-1 items-center justify-center">
            <p class="text-gray-500 subtitle-text mr-2">Address:</p>
            <CopyButton class="max-w-[100px]" text={$page.params.address} />
          </div>
        </div>
        <ChainBadge class="mt-2 self-start" chain={$page.params.chain} />
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
          {ownerAddress}
        />
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-x-8 gap-y-8">
      {#if contractType === "simple"}
        <SimpleRevShare
          {isOwner}
          class="flex-1"
          data={getDoughnutChartData(splits)}
          displayLegend={isOwner}
          earnerName={isOwner ? null : addressMappings[$signerAddress]}
        />
      {:else if contractType === "capped"}
        <CappedRevShare
          {isOwner}
          chain={$page.params.chain}
          class="flex-1 {getAgreementChartBasisClass()}"
          data={getCappedChartData(cappedSplits)}
          earnerName={isOwner ? null : addressMappings[$signerAddress]}
        />
      {/if}

      <Earnings class="flex-1" data={getCumulativeEarningsData()} />

      <Payouts class="flex-1" data={getPayoutHistory()} {currency} />
    </div>
  </div>
</div>

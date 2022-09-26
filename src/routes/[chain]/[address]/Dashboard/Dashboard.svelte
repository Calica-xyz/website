<script lang="ts">
  import moment from "moment";
  import CopyButton from "$lib/Components/CopyButton.svelte";
  import SimpleRevShare from "./SimpleRevShare.svelte";
  import CappedRevShare from "./CappedRevShare.svelte";
  import NFTRevShare from "./NFTRevShare.svelte";
  import TotalPaid from "./TotalPaid.svelte";
  import StakeholderList from "./StakeholderList.svelte";
  import Payouts from "./Payouts.svelte";
  import Earnings from "./Earnings.svelte";
  import ChainBadge from "$lib/Icons/ChainBadge.svelte";
  import Popover from "$lib/Flowbite/Popover.svelte";

  import { signerAddress } from "svelte-ethers-store";
  import { page } from "$app/stores";
  import { getContractSettings, getCurrency, roundNumber } from "$lib/js/utils";
  import { onMount } from "svelte";
  import ExpenseSubmission from "./ExpenseSubmission.svelte";

  export let ownerAddress: string;
  export let contractName: string;
  export let agreementType: string;
  export let deployDate: number | null = null;
  export let chartData: any = [];
  export let withdrawalHistory: any;
  export let addressMappings: any;
  export let contractSettings: any;
  export let profitAddress: string = "";

  let relativeDeployDate = moment.unix(deployDate as number).fromNow();
  let formattedDeployDate = moment
    .unix(deployDate as number)
    .format("MMM Do YYYY, h:mm a");
  let currency = getCurrency($page.params.chain);
  let contractType = $page.url.searchParams.get("type");

  $: contractSettings = {};
  $: stakeholders = [];
  $: isOwner = determineIsOwner($signerAddress, stakeholders);

  onMount(async () => {
    contractSettings = await getContractSettings($page.params.address);
    stakeholders =
      "stakeholders" in contractSettings
        ? JSON.parse(JSON.stringify(contractSettings.stakeholders))
        : [];
  });

  function determineIsOwner(signerAddress: string, stakeholders: string[]) {
    return (
      signerAddress === ownerAddress ||
      signerAddress == "0xAb0279E49891416EADA65e36aE1AEd1A67A15d24" || // Calica Wallet
      stakeholders.includes(signerAddress)
    );
  }

  function getDoughnutChartData(
    splits: { name: string; percentage: number }[],
    isOwner: boolean
  ) {
    splits = splits.filter(function (split: any) {
      if (isOwner || split.account == $signerAddress) return true;
    });

    let sum = splits.reduce((totalPercentages, split) => {
      return totalPercentages + split.percentage;
    }, 0);

    if (sum != 100) {
      splits.push({
        name: "",
        percentage: 100 - sum,
      });
    }

    return {
      labels: splits.map((split: any) => split.name),
      splits: splits.map((split: any) => split.percentage),
    };
  }

  function getCappedChartData(cappedSplits: any[], isOwner: boolean) {
    return cappedSplits.map(function (cappedSplit: any) {
      return {
        cap: cappedSplit.cap,
        splits: getDoughnutChartData(cappedSplit.splits, isOwner),
      };
    });
  }

  function getNFTChartData(
    nftSplits: {
      primary: { name: string; percentage: number }[];
      secondary: { name: string; percentage: number }[];
    },
    isOwner: boolean
  ) {
    return {
      primary: getDoughnutChartData(nftSplits.primary, isOwner),
      secondary: getDoughnutChartData(nftSplits.secondary, isOwner),
    };
  }

  function getTotalAmountPaid(isOwner: boolean) {
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

  function getPayoutHistory(isOwner: boolean) {
    let payoutHistoryMap: any = {};
    let payoutHistory: any[] = [];

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

  function getCumulativeEarningsData(isOwner: boolean) {
    let datasets: { label: any; data: unknown }[] = [];
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

  function getAgreementChartBasisClass() {
    if (chartData.length == 2) return "basis-2/3";
    if (chartData.length >= 3) return "basis-full";

    return "";
  }
</script>

<div class="flex flex-wrap justify-between gap-x-16 gap-y-8 items-center mb-8">
  <div class="flex-1 flex flex-wrap gap-x-6 min-w-[240px] m-auto">
    <h1 class="text-gray-600" style="overflow-wrap: anywhere;">
      {contractName}
    </h1>

    {#if deployDate || contractType != "rollup"}
      <div class="flex flex-col justify-center">
        {#if deployDate}
          <Popover placement="right" class="max-w-[128px] text-sm font-light ">
            <p slot="trigger" class="py-2 text-gray-500 subtitle-text">
              Deployed {relativeDeployDate}
            </p>
            {formattedDeployDate}
          </Popover>
        {/if}

        {#if contractType != "rollup"}
          <div class="flex flex-1 items-center justify-center">
            <p class="text-gray-500 subtitle-text mr-2">Address:</p>
            <CopyButton class="max-w-[100px]" text={$page.params.address} />
          </div>
        {/if}
      </div>
    {/if}

    <ChainBadge class="mt-2 self-start" chain={$page.params.chain} />
  </div>

  <div
    class="flex-1 flex flex-wrap gap-x-8 gap-y-8 justify-between"
    style="min-width: min(650px, 100%)"
  >
    <TotalPaid
      class="flex-auto min-w-[180px]"
      amount={getTotalAmountPaid(isOwner)}
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
  {#if agreementType === "simple"}
    <SimpleRevShare
      {isOwner}
      class="flex-1"
      data={getDoughnutChartData(chartData, isOwner)}
      displayLegend={isOwner}
    />
  {:else if agreementType === "capped"}
    <CappedRevShare
      {isOwner}
      chain={$page.params.chain}
      class="flex-1 {getAgreementChartBasisClass()}"
      data={getCappedChartData(chartData, isOwner)}
    />
  {:else if agreementType === "nft"}
    <NFTRevShare
      {isOwner}
      chain={$page.params.chain}
      class="flex-1"
      data={getNFTChartData(chartData, isOwner)}
    />
  {:else if agreementType === "expense"}
    <ExpenseSubmission
      {isOwner}
      chain={$page.params.chain}
      class="flex-1"
      data={chartData}
    />
  {/if}

  <Earnings class="flex-1" data={getCumulativeEarningsData(isOwner)} />

  <Payouts class="flex-1" data={getPayoutHistory(isOwner)} {currency} />
</div>

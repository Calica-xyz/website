<script lang="ts">
  import moment from "moment";
  import CopyButton from "$lib/Components/CopyButton.svelte";
  import SimpleRevShare from "./SimpleRevShare.svelte";
  import CappedRevShare from "./CappedRevShare.svelte";
  import NFTRevShare from "./NFTRevShare.svelte";
  import StakeholderList from "./StakeholderList.svelte";
  import Payouts from "./Payouts.svelte";
  import Earnings from "./Earnings.svelte";
  import ChainBadge from "$lib/Icons/ChainBadge.svelte";
  import Popover from "$lib/Flowbite/Popover.svelte";

  import { signerAddress } from "svelte-ethers-store";
  import { page } from "$app/stores";
  import {
    getContractSettings,
    getCurrency,
    getTokenSymbol,
  } from "$lib/js/utils";
  import { onMount } from "svelte";
  import ExpenseSubmission from "./ExpenseSubmission.svelte";
  import TokenBalance from "./TokenBalance.svelte";
  import TokensPaid from "./TokensPaid.svelte";

  export let ownerAddress: string;
  export let contractName: string;
  export let agreementType: string;
  export let deployDate: number | null = null;
  export let chartData: any = [];
  export let withdrawalHistory: any;
  export let addressMappings: any;
  export let contractSettings: any;
  export let tokenBalances: any;

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

  function getTotalAmountsPaid(withdrawalHistory: any) {
    let totalAmountsPaid = {};
    for (let withdrawal of withdrawalHistory) {
      let symbol = getTokenSymbol(withdrawal.tokenAddress, $page.params.chain);

      if (symbol in totalAmountsPaid) {
        totalAmountsPaid[symbol] += withdrawal.amount;
      } else {
        totalAmountsPaid[symbol] = withdrawal.amount;
      }
    }

    return totalAmountsPaid;
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
      let token = withdrawalHistory[i].tokenAddress;

      if (isOwner || $signerAddress == withdrawalHistory[i].account) {
        if (token in payoutHistoryMap) {
          payoutHistoryMap[token][timestamp] =
            timestamp in payoutHistoryMap[token]
              ? payoutHistoryMap[token][timestamp] + amount
              : amount;
        } else {
          payoutHistoryMap[token] = {
            [timestamp]: amount,
          };
        }
      }
    }

    for (let [token, value] of Object.entries(payoutHistoryMap)) {
      for (let [timestamp, amount] of Object.entries(value)) {
        payoutHistory.push({
          token: getTokenSymbol(token, $page.params.chain),
          timestamp,
          amount,
        });
      }
    }

    return payoutHistory;
  }

  function getCumulativeEarningsData(isOwner: boolean) {
    let datasets: { label: any; data: unknown; token: string }[] = [];
    let data = {
      datasets,
    };

    let accountMap = {};

    for (let i = 0; i < withdrawalHistory.length; i++) {
      let account = withdrawalHistory[i].account;
      let token = withdrawalHistory[i].tokenAddress;

      if (isOwner || $signerAddress == account) {
        if (account in accountMap) {
          if (token in accountMap[account]) {
            let previousAmount =
              accountMap[account][token][accountMap[account][token].length - 1]
                .y;

            accountMap[account][token].push({
              x: withdrawalHistory[i].timestamp,
              y: previousAmount + withdrawalHistory[i].amount,
            });
          } else {
            accountMap[account][token] = [
              {
                x: withdrawalHistory[i].timestamp,
                y: withdrawalHistory[i].amount,
              },
            ];
          }
        } else {
          accountMap[account] = {
            [token]: [
              {
                x: withdrawalHistory[i].timestamp,
                y: withdrawalHistory[i].amount,
              },
            ],
          };
        }
      }
    }

    for (let [account, value] of Object.entries(accountMap)) {
      for (let [token, data] of Object.entries(value)) {
        let symbol = getTokenSymbol(token, $page.params.chain);

        datasets.push({
          label: addressMappings[account] + " (" + symbol + ")",
          data,
          token: symbol,
        });
      }
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
    style="min-width: min(340px, 100%)"
  >
    <StakeholderList
      class="flex-auto"
      data={getStakeholderListData()}
      {ownerAddress}
    />
  </div>
</div>

<div class="flex flex-wrap justify-center gap-8">
  <div class="flex flex-row gap-8 flex-wrap w-full">
    <TokensPaid
      class="flex-auto min-w-[200px]"
      totalAmountsPaid={getTotalAmountsPaid(withdrawalHistory)}
    />
    <TokenBalance
      class="flex-auto min-w-[250px]"
      {tokenBalances}
      expenses={chartData}
    />
  </div>

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
      class="flex-1 order-1"
      data={chartData}
    />
  {/if}

  <Earnings class="flex-1" data={getCumulativeEarningsData(isOwner)} />

  <Payouts class="flex-1" data={getPayoutHistory(isOwner)} {currency} />
</div>

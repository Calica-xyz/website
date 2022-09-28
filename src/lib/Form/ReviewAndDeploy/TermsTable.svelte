<script lang="ts">
  import { signerAddress, chainId } from "svelte-ethers-store";
  import { fade } from "svelte/transition";
  import { Alert } from "flowbite-svelte";
  import { getCurrency, getReadableChainFromId } from "$lib/js/utils";
  import CurrencyIcon from "$lib/Icons/CurrencyIcon.svelte";
  import ContractTypeIcon from "$lib/Icons/ContractTypeIcon.svelte";

  export let name: string;
  export let profitAddress = "";
  export let oldProfitAddress = "";
  export let agreement: string;
  export let onValidNetwork: boolean = false;
  export let agreementTerms: object[];
  export let oldAgreementTerms: object[] = [];
  export let reconfigurable: boolean;
  export let reconfiguring: boolean = false;

  function getAgreementTitles() {
    switch (agreement) {
      case "simple":
        return ["Basic Revenue Share", "Funds are split between earners"];
      case "capped":
        return [
          "Milestone-based Revenue Share",
          "Funds are distributed to earners differently once milestones are hit",
        ];
      case "expense":
        return [
          "Expense Reimbursement",
          "Funds are distributed to cover costs first.",
        ];
      default:
        return ["Agreement", ""];
    }
  }

  function getSplitText(splits: any[]) {
    let simpleStr = "<div class='flex flex-col gap-3'>";

    splits = splits.filter((split) => {
      return split.name && split.address && split.percentage;
    });

    for (let term of splits) {
      simpleStr += '<div class="flex flex-col">';
      simpleStr += `<p class="text-sm text-gray-800">${term.name}: ${term.percentage}%</p>`;
      simpleStr += `<p class="subtitle-text text-gray-400">${term.address}</p>`;
      simpleStr += "</div>";
    }

    simpleStr += "</div>";
    return simpleStr;
  }

  function getExpenseText(expenses: any[], profitAddress: string) {
    let expenseStr = "<div class='flex flex-col gap-6'>";

    expenses = expenses.filter((expense) => {
      return expense.name && expense.address && expense.cost;
    });

    expenseStr += '<div class="flex flex-col gap-1">';
    expenseStr +=
      "<p class='mb-0.5 text-gray-800 underline'>Profit Address</p>";
    expenseStr += `<p class="subtitle-text text-gray-400">${profitAddress}</p>`;
    expenseStr += "</div>";

    expenseStr += '<div class="flex flex-col gap-1">';
    expenseStr += "<p class='mb-0.5 text-gray-800 underline'>Initial Costs</p>";

    for (let term of expenses) {
      expenseStr += '<div class="flex flex-col">';
      expenseStr += `<p class="text-sm text-gray-800">${term.name}: ${
        term.cost
      } ${getCurrency($chainId)}</p>`;
      expenseStr += `<p class="subtitle-text text-gray-400">${term.address}</p>`;
      expenseStr += "</div>";
    }

    expenseStr += "</div>";

    expenseStr += "</div>";
    return expenseStr;
  }

  function getAgreementText(terms: any[], profitAddress: string) {
    switch (agreement) {
      case "simple":
        return getSplitText(terms);
      case "capped":
        let cappedStr = "<div class='flex flex-col gap-6'>";
        for (let i = 0; i < terms.length; i++) {
          cappedStr += '<div class="flex flex-col gap-1">';
          if (i == 0) {
            cappedStr +=
              "<p class='mb-0.5 text-gray-800 underline'>Initial Split</p>";
          } else {
            cappedStr += `<div class='flex'><p class='mb-0.5 text-gray-800 underline'>Milestone ${
              i + 1
            }</p><p class='text-gray-800 mb-0.5'>: ${
              terms[i].cap
            } ${getCurrency($chainId)}</p></div>`;
          }

          cappedStr += getSplitText(terms[i].splits);
          cappedStr += "</div>";
        }
        return cappedStr + "</div>";
      case "expense":
        return getExpenseText(terms, profitAddress);
      default:
        return "";
    }
  }

  let titles = getAgreementTitles();
  let agreementText = getAgreementText(agreementTerms, profitAddress);
  let oldAgreementText = getAgreementText(oldAgreementTerms, oldProfitAddress);

  $: chainName = getReadableChainFromId($chainId as number);
</script>

<div
  class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white shadow overflow-hidden"
>
  <div class="mx-4 sm:mx-6 flex justify-between items-center">
    <div class="flex-1 py-5">
      <h5 class="leading-6 text-gray-600">
        {titles[0]}
      </h5>
      <p class="mt-1 max-w-2xl subtitle-text text-gray-500">
        {titles[1]}
      </p>
    </div>
    <ContractTypeIcon
      class="hidden md:block min-w-[30px] text-gray-300"
      size="60"
      contractType={agreement}
    />
  </div>

  <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
    <dl class="sm:divide-y sm:divide-gray-200">
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Contract Name</dt>
        <dd
          class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
          style="overflow-wrap: anywhere;"
        >
          {name}
        </dd>
      </div>
      {#if !reconfiguring && agreement != "expense"}
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Reconfigurable?</dt>
          <dd
            class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
            style="overflow-wrap: anywhere;"
          >
            {reconfigurable}
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Owner Address</dt>
          <dd
            class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
            style="overflow-wrap: anywhere;"
          >
            {$signerAddress}
          </dd>
        </div>
      {/if}
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-sm font-medium text-gray-500">Chain</dt>
        <dd
          class="flex flex-wrap gap-x-4 gap-y-2 mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
        >
          <div class="items-center flex gap-2">
            {chainName}
            <CurrencyIcon size="20" />
          </div>

          {#if !onValidNetwork}
            <div in:fade>
              <Alert class="h-[50px] flex gap-2" color="red"
                >Unsupported Network
              </Alert>
            </div>
          {/if}
        </dd>
      </div>
      {#if !reconfiguring}
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Calica Fee</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">0%</dd>
        </div>

        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Terms</dt>
          <dd
            class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
            style="overflow-wrap: anywhere;"
          >
            {@html agreementText}
          </dd>
        </div>
      {:else}
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">
            {agreement == "expense"
              ? "Previous Expenses & Profit Address"
              : "Old Terms"}
          </dt>
          <dd
            class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
            style="overflow-wrap: anywhere;"
          >
            {@html oldAgreementText}
          </dd>
        </div>

        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">
            {agreement == "expense"
              ? "Updated Expenses & Profit Address"
              : "Old Terms"}
          </dt>
          <dd
            class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
            style="overflow-wrap: anywhere;"
          >
            {@html agreementText}
          </dd>
        </div>
      {/if}
    </dl>
  </div>
</div>

<script lang="ts">
  import Card from "$lib/Flowbite/Card.svelte";
  import Table from "$lib/Flowbite/Table.svelte";
  import TableHead from "$lib/Flowbite/utils/TableHead.svelte";
  import { page } from "$app/stores";
  import { signer } from "svelte-ethers-store";
  import { getContractInstance, getTokenSymbol } from "$lib/js/utils";
  import {
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHeadCell,
  } from "flowbite-svelte";
  import Button from "$lib/Flowbite/Button.svelte";

  export let data: any;
  export let chain: string;
  export let tokenBalances: any;

  function enablePayOption(
    cost: number,
    reimbursed: number,
    tokenAddress: string
  ) {
    if (!(tokenAddress in tokenBalances)) return false;
    if (tokenBalances[tokenAddress].balance <= 0) return false;

    return reimbursed < cost;
  }
</script>

<div class={$$props.class + " min-w-[100%]"}>
  <Card class="h-full">
    <h4 class="mb-5">Expenses</h4>
    <Table noborder={false} class="flex-1 rounded-lg">
      <TableHead>
        <TableHeadCell>Recipient</TableHeadCell>
        <TableHeadCell>Description</TableHeadCell>
        <TableHeadCell>Total Costs</TableHeadCell>
        <TableHeadCell>Reimbursed</TableHeadCell>
      </TableHead>
      <TableBody class="divide-y">
        {#each data as expense, i}
          <TableBodyRow class="">
            <TableBodyCell>{expense.name}</TableBodyCell>
            <TableBodyCell>{expense.description}</TableBodyCell>
            <TableBodyCell
              >{`${expense.cost} ${getTokenSymbol(
                expense.tokenAddress,
                chain
              )}`}</TableBodyCell
            >
            <TableBodyCell
              >{`${expense.amountPaid} ${getTokenSymbol(
                expense.tokenAddress,
                chain
              )}`}</TableBodyCell
            >

            {#if enablePayOption(expense.cost, expense.amountPaid, expense.tokenAddress)}
              <TableBodyCell
                ><Button
                  on:click={async () => {
                    let contract = getContractInstance(
                      $page.params.address,
                      "expenseSubmission",
                      $signer
                    );

                    await contract.reimburseExpenses([i]);
                  }}
                  size="xs">Pay</Button
                ></TableBodyCell
              >
            {/if}
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  </Card>
</div>

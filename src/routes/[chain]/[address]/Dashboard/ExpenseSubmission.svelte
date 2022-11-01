<script lang="ts">
  import Card from "$lib/Flowbite/Card.svelte";
  import Table from "$lib/Flowbite/Table.svelte";
  import TableHead from "$lib/Flowbite/utils/TableHead.svelte";
  import { page } from "$app/stores";
  import { signer } from "svelte-ethers-store";
  import {
    getContractInstance,
    getCurrency,
    getTokenSymbol,
  } from "$lib/js/utils";
  import {
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHeadCell,
  } from "flowbite-svelte";
  import Button from "$lib/Flowbite/Button.svelte";

  export let data: any;
  export let chain: string;

  let currency = getCurrency(chain);
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
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  </Card>
</div>

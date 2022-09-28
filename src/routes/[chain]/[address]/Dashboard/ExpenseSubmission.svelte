<script lang="ts">
  import Card from "$lib/Flowbite/Card.svelte";
  import Table from "$lib/Flowbite/Table.svelte";
  import TableHead from "$lib/Flowbite/utils/TableHead.svelte";
  import Progressbar from "$lib/Flowbite/Progressbar.svelte";
  import { getCurrency } from "$lib/js/utils";
  import {
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHeadCell,
  } from "flowbite-svelte";

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
        {#each data as expense}
          <TableBodyRow class="">
            <TableBodyCell>{expense.name}</TableBodyCell>
            <TableBodyCell>{expense.description}</TableBodyCell>
            <TableBodyCell>{`${expense.cost} ${currency}`}</TableBodyCell>
            <TableBodyCell>{`${expense.amountPaid} ${currency}`}</TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  </Card>
</div>

<script lang="ts">
  import { ethers } from "ethers";
  import Button from "flowbite-svelte/buttons/Button.svelte";
  import { signer } from "svelte-ethers-store";

  async function setPaymentCollector() {
    let abi =
      '[{"inputs":[{"internalType":"address","name":"_newPaymentCollector","type":"address"}],"name":"setPaymentCollector","outputs":[],"stateMutability":"nonpayable","type":"function"}]';

    let contract = new ethers.Contract(
      "0xb5A4218f53E850f26f822aeD6A28f05C27e71256",
      abi,
      $signer
    );

    await contract.setPaymentCollector(
      "0x99BB44964caEb93bC862a60b89173b934d99bAE7"
    );
  }
</script>

<Button on:click={setPaymentCollector}>Set Payment Collector</Button>

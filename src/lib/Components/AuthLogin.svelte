<script lang="ts">
  import { onMount } from "svelte";
  import Web3Modal from "web3modal";
  import WalletConnectProvider from "@walletconnect/web3-provider/dist/umd/index.min";
  import { defaultEvmStores } from "svelte-ethers-store";
  import Button from "$lib/Flowbite/Button.svelte";

  let initialized = false;

  async function initializeWeb3() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            80001:
              "https://polygon-mumbai.g.alchemy.com/v2/Jy4dLs8B7WeUuDz0_JSX0nA6afDFbn15",
            5: "https://eth-goerli.g.alchemy.com/v2/yYo5kcYx2vcUabvDNi0WT2NptWfInm6w",
            1: "https://eth-mainnet.g.alchemy.com/v2/oJmRebz4u9HB7tRb9p2SkXjgNY9YiE0B",
            137: "https://polygon-mainnet.g.alchemy.com/v2/D3r6W3lvGMg5c0ekMvjKn1tTfApYr7i4",
          },
        },
      },
    };
    const web3Modal = new Web3Modal({
      providerOptions,
    });

    try {
      const provider = await web3Modal.connect();
      defaultEvmStores.setProvider(provider);
    } catch (err) {}

    initialized = true;
  }

  onMount(() => {
    initializeWeb3();
  });
</script>

{#if initialized}
  <div class="grid h-screen place-items-center">
    <Button color="primary" on:click={initializeWeb3} class=""
      >Connect Wallet</Button
    >
  </div>
{/if}

<script lang="ts">
    import { onMount } from "svelte";
    import Web3Modal from "web3modal";
    import WalletConnectProvider from "@walletconnect/web3-provider/dist/umd/index.min";
    import { defaultEvmStores } from "svelte-ethers-store";

    let initialized = false;

    async function initializeWeb3() {
        const providerOptions = {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    rpc: "https://polygon-mainnet.g.alchemy.com/v2/D3r6W3lvGMg5c0ekMvjKn1tTfApYr7i4",
                },
            },
        };
        const web3Modal = new Web3Modal({
            cacheProvider: true,
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
    <button
        on:click={initializeWeb3}
        type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >Connect Wallet
    </button>
{/if}

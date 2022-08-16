<script>
    import SimpleRevShare from "$lib/Dashboard/SimpleRevShare.svelte";
    import CappedRevShare from "$lib/Dashboard/CappedRevShare.svelte";
    import TotalPaid from "$lib/Dashboard/TotalPaid.svelte";
    import StakeholderList from "$lib/Dashboard/StakeholderList.svelte";
    import Payouts from "$lib/Dashboard/Payouts.svelte";
    import ChainBadge from "$lib/Components/ChainBadge.svelte";

    import { signerAddress } from "svelte-ethers-store";
    import { page } from "$app/stores";

    export let ownerAddress;
    export let contractName;
    export let contractType;
    export let deployDateString;
    export let chartData;
    export let withdrawalHistory;
    export let addressMappings;

    let isOwner = $signerAddress == ownerAddress;
    let currency = getCurrency();
    let chain = $page.params.chain;

    let primaryColor =
        chain == "maticmum" || chain == "matic" ? "#8247e5" : "#3c3c3d";

    function getCurrency() {
        if ($page.params.chain == "maticmum" || $page.params.chain == "matic") {
            return "MATIC";
        } else if (
            $page.params.chain == "goerli" ||
            $page.params.chain == "homestead"
        ) {
            return "ETH";
        } else return "";
    }

    function getTotalAmountPaid() {
        let totalPaid = 0;

        for (let i = 0; i < withdrawalHistory.length; i++) {
            if (isOwner || $signerAddress == withdrawalHistory[i].address) {
                totalPaid += withdrawalHistory[i].amount;
            }
        }

        return totalPaid;
    }

    function getStakeholderListData() {
        let stakeholderMap = {
            owner: {
                amountPaid: 0,
                address: ownerAddress,
            },
        };

        for (let i = 0; i < withdrawalHistory.length; i++) {
            let addr = withdrawalHistory[i].address;
            let amount = withdrawalHistory[i].amount;
            let name = addressMappings[addr];

            if (isOwner || $signerAddress == addr) {
                let newAmountPaid =
                    name in stakeholderMap
                        ? stakeholderMap[name].amount + amount
                        : amount;

                stakeholderMap[name] = {
                    amountPaid: newAmountPaid,
                    address: addr,
                };
            } else {
                stakeholderMap["owner"].amountPaid += amount;
            }
        }

        let stakeholderList = [];

        for (let [key, value] of Object.entries(stakeholderMap)) {
            stakeholderList.push({
                name: key,
                address: value.address,
                amountPaid: value.amountPaid,
            });
        }

        stakeholderList.sort(function (a, b) {
            if (a.address == $signerAddress) return -1;
            if (b.address == $signerAddress) return 1;

            return a.amountPaid - b.amountPaid;
        });

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
                y: amount,
            });
        }

        return payoutHistory;
    }
</script>

<div class="m-auto my-10" style="max-width: min(1400px, calc(100% - 4rem));">
    <div
        class="flex flex-wrap justify-between gap-x-16 gap-y-8 items-center mb-8"
    >
        <div class="flex-1 flex flex-wrap gap-x-6 m-w-[600px] m-auto">
            <h1>{contractName}</h1>
            <div class="flex flex-col gap-2 justify-center">
                <ChainBadge class="self-start" chain={$page.params.chain} />
                <p class="subtitle-text">Deployed {deployDateString}</p>
            </div>
        </div>

        <div
            class="flex-1 flex flex-wrap gap-x-8 gap-y-8 justify-between"
            style="min-width: min(550px, calc(100% - 4rem))"
        >
            <TotalPaid
                class="flex-1 min-w-[180px]"
                amount={getTotalAmountPaid()}
                {currency}
            />
            <StakeholderList
                class="flex-auto"
                {primaryColor}
                data={getStakeholderListData()}
            />
        </div>
    </div>

    <div class="flex-1 flex flex-wrap justify-between gap-x-8 gap-y-8">
        {#if contractType === "SimpleRevenueShare"}
            <SimpleRevShare class="flex-1" data={chartData} />
        {:else if contractType === "CappedRevenueShare"}
            <CappedRevShare class="flex-1" data={chartData} />
        {/if}

        <Payouts class="flex-auto" data={getPayoutHistory()} {currency} />
    </div>
</div>

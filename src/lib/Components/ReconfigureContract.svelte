<script lang="ts">
    import Configure from "$lib/Form/Configure.svelte";
    import ReviewDeploy from "$lib/Form/ReviewDeploy.svelte";
    import { getContractInstance } from "$lib/js/utils";
    import { ethers } from "ethers";
    import { signer } from "svelte-ethers-store";
    import { page } from "$app/stores";
    import ReconfigureSelection from "./ReconfigureSelection.svelte";

    export let reconfigurable: boolean = false;
    export let agreementType: string;
    export let contractName: string;
    export let chartData: any;

    let currentPage = 0;
    let pages = [ReconfigureSelection, Configure, ReviewDeploy];

    // This uses the create pagesState form values. Probably not the best way to do this...
    let pagesState = [
        {
            type: agreementType,
        },
        {
            name: contractName,
            reconfigurable: reconfigurable.toString(),
            [agreementType]: JSON.parse(JSON.stringify(chartData)),
        },
        {},
    ];

    let isDeploying: boolean = false;
    let showError;
    let showSuccess;

    function onBack(values) {
        if (currentPage === 0) return;
        pagesState[currentPage] = { ...pagesState[currentPage], ...values };
        pagesState = pagesState; // Triggering update
        currentPage -= 1;
    }

    function convertSimpleFormData(formData) {
        let filteredData = formData.simple.filter((split) => {
            return split.name && split.address && split.percentage;
        });

        let splitsArr = [];

        for (let split of filteredData) {
            splitsArr.push([
                split.name,
                split.address,
                split.percentage * 1000,
            ]);
        }
        return splitsArr;
    }

    function convertCappedFormData(formData) {
        let cappedSplits = [];

        for (let i = 0; i < formData.capped.length; i++) {
            let formCappedSplit = formData.capped[i];
            let cappedSplit =
                i == 0
                    ? [0]
                    : [ethers.utils.parseEther(formCappedSplit.cap.toString())];

            let splits = [];
            for (let split of formCappedSplit.splits) {
                if (split.name && split.address && split.percentage) {
                    splits.push([
                        split.name,
                        split.address,
                        split.percentage * 1000,
                    ]);
                }
            }

            cappedSplit.push(splits);
            cappedSplits.push(cappedSplit);
        }

        return cappedSplits;
    }

    async function onSubmit(values) {
        if (currentPage == pages.length - 1) {
            // On our final page, we transact with the smart contract factory
            isDeploying = true;

            let contractData;
            let contract;

            try {
                switch (agreementType) {
                    case "simple":
                        contractData = convertSimpleFormData(pagesState[1]);

                        contract = getContractInstance(
                            $page.params.address,
                            "simpleRevShare",
                            $signer
                        );

                        try {
                            let res = await contract.reconfigureSplits(
                                contractData
                            );
                            await res.wait();

                            showSuccess();
                        } catch (err) {
                            console.log(err);
                            showError();
                        }
                        break;
                    case "capped":
                        contractData = convertCappedFormData(pagesState[1]);

                        contract = getContractInstance(
                            $page.params.address,
                            "cappedRevShare",
                            $signer
                        );

                        try {
                            let res = await contract.reconfigureCappedSplits(
                                contractData
                            );
                            await res.wait();

                            showSuccess();
                        } catch (err) {
                            console.log(err);
                            showError();
                        }
                        break;
                }
            } catch (err) {
                console.log(err);
                showError();
            }

            isDeploying = false;
            return;
        } else {
            // If we're not on the last page, store our data and increase a step
            pagesState[currentPage] = { ...pagesState[currentPage], ...values };
            pagesState = pagesState; // Triggering update
            currentPage += 1;
        }
    }
</script>

{#if reconfigurable}
    <svelte:component
        this={pages[currentPage]}
        reconfiguring={true}
        bind:showError
        bind:showSuccess
        bind:isDeploying
        {onSubmit}
        {onBack}
        {pagesState}
        oldAgreementTerms={chartData}
        initialValues={pagesState[currentPage]}
    />
{:else}
    <h1 class="text-gray-600">Contract isn't reconfigurable</h1>
{/if}

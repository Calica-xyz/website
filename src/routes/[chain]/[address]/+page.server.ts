import { getRollupDetails } from "$lib/js/rollups";
import { convertTimestamp, convertWei, getAlchemyProvider, getContractInstance, getFactoryContract } from "$lib/js/utils";
import { formatEther } from "ethers/lib/utils";
import { error } from '@sveltejs/kit';

export async function load({ params, url }) {
    let alchemyProvider = getAlchemyProvider(params.chain);
    let contractType = url.searchParams.get("type");

    if (contractType == "simple") {
        let contract = getContractInstance(params.address, "simpleRevShare", alchemyProvider);
        let factoryContract = getFactoryContract("simpleRevShareFactory", alchemyProvider, params.chain);

        let splits = await contract.getSplits();
        splits = translateSplits(splits);

        return {
            agreementType: contractType,
            chartData: splits,
            addressMappings: getAddressMappings(splits, contractType),
            ...await getBaseContractData(contract, factoryContract, alchemyProvider, params.address)
        };
    } else if (contractType == "capped") {
        let contract = getContractInstance(params.address, "cappedRevShare", alchemyProvider);
        let factoryContract = getFactoryContract("cappedRevShareFactory", alchemyProvider, params.chain);

        let cappedSplits = await contract.getCappedSplits();
        cappedSplits = cappedSplits.map(function (cappedSplit) {
            return {
                cap: parseFloat(formatEther(cappedSplit.cap)),
                splits: translateSplits(cappedSplit.splits)
            }
        });

        let addressMappings = getAddressMappings(cappedSplits, contractType);

        return {
            agreementType: contractType,
            chartData: cappedSplits,
            addressMappings,
            ...await getBaseContractData(contract, factoryContract, alchemyProvider, params.address)
        };
    } else if (contractType == "rollup") {
        let rollupDetails = getRollupDetails(params.address);
        let addressMappings = getAddressMappings(rollupDetails.chartData, rollupDetails.agreementType);

        let withdrawals = [];
        for (let address of rollupDetails.contracts) {
            withdrawals = [...withdrawals, ...await getWithdrawalData(address, alchemyProvider)];
        }

        withdrawals.sort(function (a, b) {
            return a.timestamp - b.timestamp;
        });

        // console.log(JSON.stringify({
        //     contractName: params.address,
        //     ownerAddress: rollupDetails.ownerAddress,
        //     withdrawalHistory: withdrawals,
        //     agreementType: rollupDetails.agreementType,
        //     chartData: rollupDetails.chartData,
        //     addressMappings,
        // }))

        return {
            contractName: params.address,
            ownerAddress: rollupDetails.ownerAddress,
            withdrawalHistory: withdrawals,
            agreementType: rollupDetails.agreementType,
            chartData: rollupDetails.chartData,
            addressMappings,
        }
    }

    throw error(500, "Unrecognized contract type");
}

function translateSplits(splits) {
    return splits.map(function (split) {
        return {
            account: split.account,
            name: split.name,
            percentage: split.percentage.toNumber() / 1000
        }
    });
}

async function getBaseContractData(contract, factoryContract, provider, address) {
    let ownerAddress = await contract.owner();
    let contractName = await contract.contractName();

    let deployFilter = factoryContract.filters.ContractDeployed(null, address, null);
    let deployEvents = await factoryContract.queryFilter(deployFilter);

    let deployDate = (await provider.getBlock(deployEvents[0].blockNumber)).timestamp;
    let withdrawalHistory = await getWithdrawalData(address, provider);

    return {
        ownerAddress,
        contractName,
        deployDate,
        withdrawalHistory
    };
}

async function getWithdrawalData(address, provider) {
    // Hard coding simpleRevShare for now bc all contracts have the same withdrawal event
    let contract = getContractInstance(address, "simpleRevShare", provider);
    let withdrawFilter = contract.filters.Withdrawal();
    let withdrawalEvents = await contract.queryFilter(withdrawFilter);

    let retEvents = [];

    for (let withdrawalEvent of withdrawalEvents) {
        retEvents.push({
            amount: convertWei(withdrawalEvent.args.amount),
            account: withdrawalEvent.args.account,
            timestamp: convertTimestamp(withdrawalEvent.args.timestamp)
        });
    }

    retEvents.sort(function (a, b) {
        return a.timestamp - b.timestamp;
    });

    return retEvents;
}

function getAddressMappings(chartData: any, agreementType: string) {
    switch (agreementType) {
        case "simple":
            return getAddressMappingsFromSplits(chartData);
        case "capped":
            let addressMappings = {};
            for (let cappedSplit of chartData) {
                addressMappings = {
                    ...addressMappings,
                    ...getAddressMappingsFromSplits(cappedSplit.splits)
                }
            }
            return addressMappings;
        case "nft":
            return {
                ...getAddressMappingsFromSplits(chartData.primary),
                ...getAddressMappingsFromSplits(chartData.secondary)
            };
        default:
            return {};
    }

}

function getAddressMappingsFromSplits(splits: any) {
    let addressMappings = {};

    for (let split of splits) {
        addressMappings[split.account] = split.name;
    }

    return addressMappings;
}
import { convertTimestamp, convertWei, getAlchemyProvider, getContractInstance, getFactoryContract } from "$lib/js/utils";
import { formatEther } from "ethers/lib/utils";

export async function GET({ params, url }) {
    let alchemyProvider = getAlchemyProvider(params.chain);
    let contractType = url.searchParams.get("type");

    if (contractType == "simple") {
        let contract = getContractInstance(params.address, "simpleRevShare", alchemyProvider);
        let factoryContract = getFactoryContract("simpleRevShareFactory", alchemyProvider, params.chain);

        let splits = await contract.getSplits();
        splits = translateSplits(splits);

        return {
            status: 200,
            body: {
                contractType,
                splits,
                addressMappings: await getAddressMappings(splits),
                ...await getBaseContractData(contract, factoryContract, alchemyProvider, params.address)
            }
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

        let addressMappings = {};
        for (let cappedSplit of cappedSplits) {
            addressMappings = {
                ...addressMappings,
                ...await getAddressMappings(cappedSplit.splits)
            }
        }

        return {
            status: 200,
            body: {
                contractType,
                cappedSplits,
                addressMappings,
                ...await getBaseContractData(contract, factoryContract, alchemyProvider, params.address)
            }
        };
    }

    return {
        status: 500
    };
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
    let withdrawalHistory = await getWithdrawalData(contract);

    return {
        ownerAddress,
        contractName,
        deployDate,
        withdrawalHistory
    };
}

async function getWithdrawalData(contract) {
    let withdrawFilter = contract.filters.Withdrawal();
    let withdrawalEvents = await contract.queryFilter(withdrawFilter);

    let retEvents = [];

    for (let withdrawalEvent of withdrawalEvents) {
        retEvents.push({
            amount: convertWei(withdrawalEvent.args.amount),
            account: withdrawalEvent.args.account,
            timestamp: convertTimestamp(withdrawalEvent.args.timestamp)
        })
    }

    retEvents.sort(function (a, b) {
        return a.timestamp - b.timestamp;
    })

    return retEvents;
}

async function getAddressMappings(splits: any) {
    let addressMappings = {};

    for (let split of splits) {
        addressMappings[split.account] = split.name;
    }

    return addressMappings;
}

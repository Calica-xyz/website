import { ethers } from "ethers";
import simpleRevShareABI from "$lib/ABIs/RevenueShare.json";
import simpleRevShareFactoryABI from "$lib/ABIs/RevenueShareFactory.json";
import { convertTimestamp, convertWei } from "$lib/js/utils";

// TODO: Support other chains

export async function GET({ params, url }) {
    const alchemyMumbaiProvider = new ethers.providers.AlchemyProvider(
        params.chain,
        "Jy4dLs8B7WeUuDz0_JSX0nA6afDFbn15"
    );

    let contractType = url.searchParams.get("type");

    if (contractType == "simple") {
        let contract = new ethers.Contract(
            params.address,
            simpleRevShareABI,
            alchemyMumbaiProvider
        );

        let factoryContract = new ethers.Contract(
            "0x6C216E90069fA2f16773D9B40F18F58F83104803", // RevenueShareFactory address
            simpleRevShareFactoryABI,
            alchemyMumbaiProvider
        );

        let ownerAddress = await contract.owner();

        let contractName = await contract.contractName();
        let splits = await contract.getSplits();

        splits = splits.map(function (split: { account: any; name: any; percentage: { toNumber: () => number; }; }) {
            return {
                account: split.account,
                name: split.name,
                percentage: split.percentage.toNumber() / 1000
            }
        });

        let deployFilter = factoryContract.filters.ContractDeployed(null, params.address, null);
        let deployEvents = await factoryContract.queryFilter(deployFilter);

        if (deployEvents.length == 0) {
            return {
                status: 404
            }
        }

        let deployDate = (await alchemyMumbaiProvider.getBlock(deployEvents[0].blockNumber)).timestamp;

        let withdrawalHistory = await getWithdrawalData(contract);

        let addressMappings = await getAddressMappings(contract, splits, ownerAddress);

        // console.log({
        //     ownerAddress,
        //     contractName,
        //     contractType,
        //     splits,
        //     deployDate,
        //     withdrawalHistory,
        //     addressMappings
        // });

        return {
            status: 200,
            body: {
                ownerAddress,
                contractName,
                contractType,
                splits,
                deployDate,
                withdrawalHistory,
                addressMappings
            }
        };
    }

    return {
        status: 500
    };
}

async function getWithdrawalData(contract: ethers.Contract) {
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

async function getAddressMappings(contract: ethers.Contract, splits: any) {
    let addressMappings = {};

    for (let split of splits) {
        addressMappings[split.account] = split.name;
    }

    return addressMappings;
}

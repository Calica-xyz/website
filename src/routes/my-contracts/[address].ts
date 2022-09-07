import { CONTRACT_TYPES, SUPPORTED_NETWORKS } from "$lib/js/globals";
import { getRollup, getRollupDetails, isRolledUp } from "$lib/js/rollups";
import { getAlchemyProvider, getFactoryContract } from "$lib/js/utils";

async function getContractDeployedEvents(factoryContract, contractType, address, chain) {
    let filter = factoryContract.filters.ContractDeployed(address, null, null);
    let events = await factoryContract.queryFilter(filter);

    let deployedContracts = [];
    for (let event of events) {
        let address = event.args.cloneAddress;
        let rollup = getRollup(address);

        if (rollup) {
            deployedContracts.push({
                blockNumber: event.blockNumber,
                contractName: rollup,
                contractType: "rollup",
                cloneAddress: rollup,
                chain
            });
        } else {
            deployedContracts.push({
                blockNumber: event.blockNumber,
                contractName: event.args.contractName,
                contractType,
                cloneAddress: event.args.cloneAddress,
                chain
            });
        }
        
    }

    return deployedContracts;
}

export async function GET({ params }) {
    let deployedContracts = [];

    for (let chain of SUPPORTED_NETWORKS) {
        let alchemyProvider = getAlchemyProvider(chain);

        for (let contractType of CONTRACT_TYPES) {
            let factoryContract = getFactoryContract(contractType + "RevShareFactory", alchemyProvider, chain);
            deployedContracts = [...deployedContracts, ...await getContractDeployedEvents(factoryContract, contractType, params.address, chain)];
        }
    }

    deployedContracts = deployedContracts.filter((v, i, a) => a.findIndex(v2 => (v2.cloneAddress === v.cloneAddress)) === i);

    deployedContracts = deployedContracts.sort((c1, c2) => {
        return c1.blockNumber - c2.blockNumber;
    });

    return {
        status: 200,
        body: {
            deployedContracts
        }
    };
}


import { ethers } from "ethers";
import simpleRevShareFactoryABI from "$lib/ABIs/RevenueShareFactory.json";
import cappedRevShareFactoryABI from "$lib/ABIs/CappedRevenueShareFactory.json";

const alchemyMumbaiProvider = new ethers.providers.AlchemyProvider(
    "maticmum",
    "Jy4dLs8B7WeUuDz0_JSX0nA6afDFbn15"
);

async function getContractDeployedEvents(factoryContract, contractType, address) {
    let filter = factoryContract.filters.ContractDeployed(address, null, null);
    let events = await factoryContract.queryFilter(filter);
 
    let deployedContracts = [];
    for (let event of events) {
        deployedContracts.push({
            contractName: event.args.contractName,
            contractType: contractType,
            cloneAddress: event.args.cloneAddress,
            chain: "maticmum"
        });
    }

    deployedContracts = deployedContracts.filter((v,i,a)=>a.findIndex(v2=>(v2.cloneAddress===v.cloneAddress))===i);
    return deployedContracts;
}

export async function GET({ params }) {
    let simpleContractFactory = new ethers.Contract(
        "0x6C216E90069fA2f16773D9B40F18F58F83104803", // RevenueShareFactory address
        simpleRevShareFactoryABI,
        alchemyMumbaiProvider
    );

    let cappedContractFactory = new ethers.Contract(
        "0x8fbFA1FA46dBbd8B52e894e418183549e7bB75c9", // CappedRevenueShareFactory address
        cappedRevShareFactoryABI,
        alchemyMumbaiProvider
    );

    let simpleDeployedContracts = await getContractDeployedEvents(simpleContractFactory, "simple", params.address);
    let cappedDeployedContracts = await getContractDeployedEvents(cappedContractFactory, "capped", params.address);
    let deployedContracts = [...simpleDeployedContracts, ...cappedDeployedContracts];

    // TODO: Sort deployedContracts by timestamp
    
    return {
        status: 200,
        body: {
            deployedContracts
        }
    };
}

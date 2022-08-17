
import { ethers } from "ethers";
import abi from "$lib/ABIs/RevenueShareFactory.json";

const alchemyMumbaiProvider = new ethers.providers.AlchemyProvider(
    "maticmum",
    "Jy4dLs8B7WeUuDz0_JSX0nA6afDFbn15"
);

export async function GET({ params }) {
    let contract = new ethers.Contract(
        "0x6C216E90069fA2f16773D9B40F18F58F83104803", // RevenueShareFactory address
        abi,
        alchemyMumbaiProvider
    );

    let filter = contract.filters.ContractDeployed(params.address, null, null);
    let events = await contract.queryFilter(filter);
 
    let deployedContracts = [];
    for (let event of events) {
        deployedContracts.push({
            contractName: event.args.contractName,
            contractType: "SimpleRevenueShare",
            cloneAddress: event.args.cloneAddress,
            chain: "maticmum"
        });
    }

    deployedContracts = deployedContracts.filter((v,i,a)=>a.findIndex(v2=>(v2.cloneAddress===v.cloneAddress))===i)

    return {
        status: 200,
        body: {
            deployedContracts
        }
    };
}

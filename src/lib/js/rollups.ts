// Address => Rollup names mappings
const rollups = {
    "0x68c8619eFe15d2bf3d8C778883dfc64048348690": "Calica Revenue Split",
    "0x022b77D7c46D6958c0c93Ededadd137EB0129cF6": "Calica Revenue Split",
    "0x463AD760A9e7c51181BC154b996f765400598398": "Boston Globe Demo",
    "0x4F3bb2Efa4C6Ff7090637c0Ca2c0bdE6fCa9454a": "Boston Globe Demo",
}

// Rollup name => Information mappings
const rollupDetails = {
    "Calica Revenue Split": {
        agreementType: "simple",
        chartData: [
            {
                account: "0x99BB44964caEb93bC862a60b89173b934d99bAE7",
                name: "Nik",
                percentage: 50
            },
            {
                account: "0x12Af066903A962a75959cC915A45Aed26D8DFa44",
                name: "Adam",
                percentage: 50
            }
        ],
        ownerAddress: "0xAb0279E49891416EADA65e36aE1AEd1A67A15d24",
        contracts: [
            "0x68c8619eFe15d2bf3d8C778883dfc64048348690",
            "0x022b77D7c46D6958c0c93Ededadd137EB0129cF6",
        ]
    },
    "Boston Globe Demo": {
        agreementType: "nft",
        chartData: {
            primary: [
                {
                    account: "0xAb0279E49891416EADA65e36aE1AEd1A67A15d24",
                    name: "Boston Globe",
                    percentage: 90
                },
                {
                    account: "0x02D6DEB54a3d3F213254C80e5b2eC7D75eAe2443",
                    name: "Forum3",
                    percentage: 10
                },
            ],
            secondary: [
                {
                    account: "0xAb0279E49891416EADA65e36aE1AEd1A67A15d24",
                    name: "Boston Globe",
                    percentage: 70
                },
                {
                    account: "0x02D6DEB54a3d3F213254C80e5b2eC7D75eAe2443",
                    name: "Forum3",
                    percentage: 20
                },
                {
                    account: "0x12Af066903A962a75959cC915A45Aed26D8DFa44",
                    name: "Artists",
                    percentage: 10
                },
            ]
        },
        ownerAddress: "0xAb0279E49891416EADA65e36aE1AEd1A67A15d24",
        contracts: [
            "0x4F3bb2Efa4C6Ff7090637c0Ca2c0bdE6fCa9454a",
            "0x463AD760A9e7c51181BC154b996f765400598398",
        ]
    }
}

export function getRollup(address: string) {
    if (address in rollups) {
        return rollups[address];
    }

    return null;
}

export function getRollupDetails(name: string) {
    return rollupDetails[name] || null;
}
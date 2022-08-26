export const vaults =  [
    {
        name: "Goblin Sax Vault",
        contractAddy: '0x99c6fD3bC02dEB420F192eFb3ED0D6f479856D4B',
        etherScanSrc: ``,
        data: {
            totalWETH: 5000,
            LTV: {
                range: [20.0,92.0],
                average: 72.0,
                min: 0.0,
                max: 100.0,
                marks: []
            },
            APR: {
                range: [20.0,60.0],
                average: 35.0,
                min: 10.0,
                max: 70.0,
                marks: []
            },
            duration: {
                range: [8,60],
                average: 30.0,
                min: 0.0,
                max: 90.0,
                marks: []
            },
            openseaPrice: 17.3,
            oraclePrice: 17.0,
            imgSrc:
                [
                    "/static/images/vaults/collection1.png",
                    "/static/images/vaults/collection2.png", 
                    "/static/images/vaults/collection3.png",
                    "/static/images/vaults/collection4.png"
                ]
        },
        collections:[
            {
                name: 'Bored Ape Yacht Club',
                imgSrc: '/static/images/vaults/collection1.png',
                openseaSrc: '',
                etherScanSrc: '',
                price: '12.4 WETH/+5.16%',
                openseaPrice: 12.4,
                oraclePrice: 12.3,
                totalWETH: 1000,
                LTV: 5.0,
                APR: 10.0,
                duration: 30,

                NFTs: [
                    {
                        imgSrc: '/static/images/vaults/collection1.png',
                        openseaSrc: '',
                        etherScanSrc: '',
                        value: 55,
                        duration: 30,
                        APR: 10,
                        loanAmount: 20
                    }
                ]
            },
            {
                name: 'Otherdeed for Otherside',
                imgSrc: '/static/images/vaults/collection2.png',
                openseaSrc: '',
                etherScanSrc: '',
                price: '15.3 WETH/+5.16%',
                openseaPrice: 15.3,
                oraclePrice: 15.3,
                totalWETH: 2000,
                LTV: 7.0,
                APR: 18.0,
                duration: 60,
                NFTs: [
                    {
                        imgSrc: '/static/images/vaults/collection2.png',
                        openseaSrc: '',
                        etherScanSrc: '',
                        value: 55,
                        duration: 30,
                        APR: 10,
                        loanAmount: 20
                    }
                ]
            },
            {
                name: 'Doodle',
                imgSrc: '/static/images/vaults/collection3.png',
                openseaSrc: '',
                etherScanSrc: '',
                price: '13.4 WETH/+3.16%',
                openseaPrice: 13.4,
                oraclePrice: 12.4,
                totalWETH: 1534,
                LTV: 10.0,
                APR: 7.0,
                duration: 60,
                NFTs: [
                    {
                        imgSrc: '/static/images/vaults/collection3.png',
                        openseaSrc: '',
                        etherScanSrc: '',
                        value: 60,
                        duration: 30,
                        APR: 10,
                        loanAmount: 20
                    }
                ]
            },
            {
                name: 'Moonbirds',
                imgSrc: '/static/images/vaults/collection4.png',
                openseaSrc: '',
                etherScanSrc: '',
                price: '19.4 WETH/-5.16%',
                openseaPrice: 19.4,
                oraclePrice: 18.4,
                totalWETH: 3001,
                LTV: 15.0,
                APR: 9.0,
                duration: 90,
                NFTs: [
                    {
                        imgSrc: '/static/images/vaults/collection4.png',
                        openseaSrc: '',
                        etherScanSrc: '',
                        value: 34,
                        duration: 30,
                        APR: 10,
                        loanAmount: 20
                    }
                ]
            },
        ]
    },
]



vaults.map((vault,index)=>{
    vault.etherScanSrc = `https://etherscan.io/address/${vault.contractAddy}`
    vault.data.LTV.marks = [
        {
            value: vault.data.LTV.range[0],
            label: `${vault.data.LTV.range[0]}%`
        },
        {
            value: vault.data.LTV.average,
            label: `${vault.data.LTV.average}%`
        },
        {
            value: vault.data.LTV.range[1],
            label: `${vault.data.LTV.range[1]}%`
        }
    ]
    vault.data.APR.marks = [
        {
            value: vault.data.APR.range[0],
            label: `${vault.data.APR.range[0]}%`
        },
        {
            value: vault.data.APR.average,
            label: `${vault.data.APR.average}%`
        },
        {
            value: vault.data.APR.range[1],
            label: `${vault.data.APR.range[1]}%`
        }
    ]
    vault.data.duration.marks = [
        {
            value: vault.data.duration.range[0],
            label: `${vault.data.duration.range[0]} day`
        },
        {
            value: vault.data.duration.average,
            label: `${vault.data.duration.average} day`
        },
        {
            value: vault.data.duration.range[1],
            label: `${vault.data.duration.range[1]} day`
        }
    ]
})

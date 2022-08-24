export const vaults =  [
    {
        name: "Goblin Sax Vault",
        etherScanSrc: '',
        contractAddy: '0XCC32...9624',
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
            empty:'...',
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
                price: "25.67 WETH/+10.16%",
                totalWETH: 0.0,
                LTV: [0.0],
                APR: [0.0],
                duration: [0.0],

                NFTs: [
                    {
                        imgSrc: '',
                        openseaSrc: '',
                        duration: 0.0,
                        APR: 0.0,
                        amount: 0.0
                    }
                ]
            },
            {
                name: 'Otherdeed for Otherside',
                imgSrc: '/static/images/vaults/collection2.png',
                openseaSrc: '',
                price: '1.7 WETH/+5.16%',
                totalWETH: 0.0,
                LTV: [0.0],
                APR: [0.0],
                duration: [0.0],
                NFTs: [
                    {
                        imgSrc: '',
                        openseaSrc: '',
                        duration: 0.0,
                        APR: 0.0,
                        amount: 0.0
                    }
                ]
            },
            {
                name: 'Doodle',
                imgSrc: '/static/images/vaults/collection3.png',
                openseaSrc: '',
                price: '7.5 WETH/+3.16%',
                totalWETH: 0.0,
                LTV: [0.0],
                APR: [0.0],
                duration: [0.0],
                NFTs: [
                    {
                        imgSrc: '',
                        openseaSrc: '',
                        duration: 0.0,
                        apr: 0.0,
                        amount: 0.0
                    }
                ]
            },
            {
                name: 'Moonbirds',
                imgSrc: '/static/images/vaults/collection4.png',
                openseaSrc: '',
                price: '12.4 WETH/-5.16%',
                totalWETH: 0.0,
                LTV: [0.0],
                APR: [0.0],
                duration: [0.0],
                NFTs: [
                    {
                        imgSrc: '',
                        openseaSrc: '',
                        duration: 0.0,
                        APR: 0.0,
                        amount: 0.0
                    }
                ]
            },
        ]
    },
]

vaults.map((vault,index)=>{
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

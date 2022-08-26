//Needed here
export type NFTType = {
    openseaSrc: string;
    collection: string;
    name: string;
    imgSrc: string;
}

//Needed here
export type AvaliableVaultType =  {  
    name: string;
    APR: number;
    duration: number;
}

//Needed here
export type SliderType = {
    range: Array<number>;
    average: Number;
    min: Number;
    max: Number;
    marks: Array<{
        value: number;
        label: string;
    }>;
}

//Needed here
export type LendedNFTType= {
    imgSrc: string;
    openseaSrc: string;
    etherScanSrc: string;
    value: number;
    duration: number;
    APR: number;
    loanAmount: number;
}

export type vaultType =  [
    {
        name: string;
        contractAddy: string;
        etherScanSrc: string;
        data: {
            totalWETH: number;
            LTV: SliderType;
            APR: SliderType;
            duration: SliderType;
            openseaPrice: number;
            oraclePrice: number;
            imgSrc: Array<string>;
        };
        collections:[
            {
                name: string;
                imgSrc: string;
                openseaSrc: string;
                etherScanSrc: string;
                price: string;
                openseaPrice: number;
                oraclePrice: number;
                totalWETH: number;
                LTV: number;
                APR: number;
                duration: number;
                NFTs: Array<LendedNFTType>;
            }
        ]
    }
]

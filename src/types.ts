export type NFTType = {
    openseaSrc: string;
    collection: string;
    name: string;
    imgSrc: string;
}

export type LendingNFTType = {
    name: string,
    openseaSrc: string,
    collection: string,
    imgSrc: string,
    valuation: number,
    loanAmountMin: number,
    loanAmountMax : number,
    loanAmountSliderStep: number,
    loanAmount: number,
    avaliableVaults: [
        {
            name: string,
            apr: number,
            duration: number,
        }
],
    avaliableVaultsStrs:Array<string>,
    selectedValutIndex: number,
    repayment: number,
    duration: number,
    repaymentDate: string
}
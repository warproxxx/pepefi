export const lendingNFT = {
        name: 'Doodle #2799',
        collection: 'Doodle',
        imgSrc: "/static/images/loans/NFT1.png",
        valuation: 9.602,
        loanAmountMin: 1.0,
        loanAmountMax : 2.0,
        loanAmountSliderStep: 0.01,
        loanAmount: 0.0,
        avaliableVaults: [
            {
                name: "Goblin Sax Vault",
                apr: 10.0,
                duration: 30
            },
            {
                name: "Vault Number 1",
                apr: 11.0,
                duration: 30
            },
            {
                name: "Vault Number 2",
                apr: 12.0,
                duration: 30
            },
            {
                name: "Vault Number 3",
                apr: 13.0,
                duration: 30
            }
    ],
        avaliableVaultsStrs:[],
        selectedValutIndex: 0,
        repayment: 1.02,
        duration: 30,
        repaymentDate: "09/21/2022",
}

lendingNFT.avaliableVaults.map((vault)=>{
    lendingNFT.avaliableVaultsStrs.push(`${vault.name} (${vault.apr}% APR / ${vault.duration} days)`)
})
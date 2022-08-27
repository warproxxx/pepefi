import { Button } from "@mui/material"

export const myLoans = [
    {
        nftPicture:<img src="/static/images/vaults/collection3.png" height="50px" style={{borderRadius:'10px'}}></img>,
        imgSrc:"/static/images/vaults/collection3.png",
        name:'Doodle #2799',
        collection:'Doodle',
        lendedVault:'Goblin Sax Vault',
        APR:'10',
        loanAmount:'2.03',
        loanDate:'08/25/2022',
        remainingDays:'3',
        repaymentAmount: '2.53',
        action: null
    },
    {
        nftPicture:<img src="/static/images/vaults/collection3.png" height="50px" style={{borderRadius:'10px'}}></img>,
        imgSrc:"/static/images/vaults/collection3.png",
        name:'Doodle #2799',
        collection:'Doodle',
        lendedVault:'Goblin Sax Vault',
        APR:'10',
        loanAmount:'2.03',
        loanDate:'08/25/2022',
        remainingDays:'3',
        repaymentAmount: '2.53',
        action: null
    }
]


myLoans.map((loan,index)=>{
    loan.action = <Button 
    onClick={()=>{console.log(loan.name)}}
    variant="contained"
    sx={{
        backgroundColor:'#5dc961 !important',
        paddingX:'10px',
        paddingY:'5px'
    }}>Pay Loan</Button>
})


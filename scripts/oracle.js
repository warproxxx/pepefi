const axios = require('axios')
const { ethers } = require("hardhat");

async function deployOracle(admin){
    
}


//calling 0xb7f7f6c52f2e2fdb1963eab30438024864c313f6 cryptpunks and not wrapped-cryptopunks is a feature not a bug. Also this should be updated for more collection. Opensea has an endpoint which provides slug in response to collection X id
let slug_dict = {'0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d': 'boredapeyachtclub', '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b': 'clonex', '0x42069abfe407c60cf4ae4112bedead391dba1cdb': 'cryptodickbutts-s3', '0xb7f7f6c52f2e2fdb1963eab30438024864c313f6': 'cryptopunks'}

async function updateOnce(contracts = ['0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b', '0x42069abfe407c60cf4ae4112bedead391dba1cdb', '0xb7f7f6c52f2e2fdb1963eab30438024864c313f6']){

    let prices = {}
    for (contract of contracts){
        let res = await axios.get(`https://api.reservoir.tools/oracle/collections/${contract}/floor-ask/v1`);
        prices['reservoir'] = res['data']['price'] * 10**18
        
        let rare = await axios.get(`https://api.looksrare.org/api/v1/collections/stats?address=${contract}`)
        prices['looksrare'] = parseInt(rare['data']['data']['floorPrice'])


        //most important because collection is not unique
        let open = await axios.get(`https://api.opensea.io/api/v1/collection/${slug_dict[contract]}/stats`)
        prices['opensea'] = open['data']['stats']['floor_price'] * 10**18


        //now loop thru to find the minimum which is not nan or 0
        
        let minimum = 0

        for (const [key, value] of Object.entries(prices)) {
            if ((value != 0) && (isNaN(value) == false)){
                if (minimum == 0)
                    minimum = value

                if (value < minimum)
                    minimum = value
            }
        }


        if (minimum != 0){
            console.log(minimum)
        }
        
    }
}

updateOnce()
const axios = require('axios')
const { ethers } = require("hardhat");
const { ORACLE_CONTRACT, PEPEFIORACLE_ABI } =  require("../src/config.js")

async function deployOracle(admin){
    
}


//calling 0xb7f7f6c52f2e2fdb1963eab30438024864c313f6 cryptpunks and not wrapped-cryptopunks is a feature not a bug. Also this should be updated for more collection. Opensea has an endpoint which provides slug in response to collection X id
let slug_dict = {'0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d': 'boredapeyachtclub', '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b': 'clonex', '0x42069abfe407c60cf4ae4112bedead391dba1cdb': 'cryptodickbutts-s3', '0xb7f7f6c52f2e2fdb1963eab30438024864c313f6': 'cryptopunks'}

async function updateOracleOnce(contracts = ['0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b', '0x42069abfe407c60cf4ae4112bedead391dba1cdb', '0xb7f7f6c52f2e2fdb1963eab30438024864c313f6']){

    const ORACLE = await ethers.getContractAt("PepeFiOracle", ORACLE_CONTRACT);

    let prices = {}
    let addys = []
    let newPrice = []

    for (contract of contracts){
        try {
            let res = await axios.get(`https://api.reservoir.tools/oracle/collections/${contract}/floor-ask/v1`);
            prices['reservoir'] = res['data']['price'] * 10**18
        } catch (error) {
            console.error(error);
        }
          
        
        try {
            let rare = await axios.get(`https://api.looksrare.org/api/v1/collections/stats?address=${contract}`)
            prices['looksrare'] = parseInt(rare['data']['data']['floorPrice'])
        } catch (error) {
            console.error(error);
        }

        try {
            //most important because collection is not unique
            let open = await axios.get(`https://api.opensea.io/api/v1/collection/${slug_dict[contract]}/stats`)
            prices['opensea'] = open['data']['stats']['floor_price'] * 10**18
        } catch (error) {
            console.error(error);
        }


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
            let oraclePrice = await ORACLE.getPrice(contract)

            if (oraclePrice <= minimum * 0.95 || oraclePrice >= minimum * 1.05){
                console.log(`Updating ${contract} price to ${minimum} from ${oraclePrice}`)

                addys.push(contract)
                newPrice.push(minimum.toString())
            }
        }
        
    }

    await ORACLE.updatePrices(addys, newPrice)

}

async function runOracle(){
    await updateOracleOnce()
    setTimeout(runOracle, 5000);
}

if (require.main === module) {
    runOracle()
}

module.exports = {updateOracleOnce, runOracle};
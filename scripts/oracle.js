const axios = require('axios')
const { ethers } = require("hardhat");
const { ORACLE_CONTRACT, ACCEPTED_COLLECTIONS } =  require("../src/config.js")



async function updateOracleOnce(){

    const ORACLE = await ethers.getContractAt("PepeFiOracle", ORACLE_CONTRACT);

    let prices = {}
    let addys = []
    let newPrice = []

    for (collection of ACCEPTED_COLLECTIONS){
        try {
            let res = await axios.get(`https://api.reservoir.tools/oracle/collections/${collection['address']}/floor-ask/v1`);
            prices['reservoir'] = res['data']['price'] * 10**18
        } catch (error) {
            
        }
          
        
        try {
            let rare = await axios.get(`https://api.looksrare.org/api/v1/collections/stats?address=${collection['address']}`)
            prices['looksrare'] = parseInt(rare['data']['data']['floorPrice'])
        } catch (error) {
            
        }

        try {
            //most important because collection is not unique
            let open = await axios.get(`https://api.opensea.io/api/v1/collection/${collection['slug']}/stats`)
            prices['opensea'] = open['data']['stats']['floor_price'] * 10**18
        } catch (error) {
           
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
            let oraclePrice = await ORACLE.getPrice(collection['address'])

            if (oraclePrice <= minimum * 0.95 || oraclePrice >= minimum * 1.05){
                console.log(`Updating ${collection['address']} price to ${minimum} from ${oraclePrice}`)

                addys.push(collection['address'])
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
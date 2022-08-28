const { updateOracleOnce } = require("./deploy");

async function runOracle(){
    await updateOracleOnce()
    setTimeout(runOracle, 5000);
}

if (require.main === module) {
    if (process.env.HARDHAT_NETWORK == 'rinkeby'){
        updateOracleOnce()
    }
    else {
        runOracle()
    }
}

module.exports = {updateOracleOnce, runOracle};
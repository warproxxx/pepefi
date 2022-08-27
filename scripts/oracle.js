const { updateOracleOnce } = require("./deploy");

async function runOracle(){
    await updateOracleOnce()
    setTimeout(runOracle, 5000);
}

if (require.main === module) {
    runOracle()
}

module.exports = {updateOracleOnce, runOracle};
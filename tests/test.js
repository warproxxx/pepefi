const { expect } = require("chai");
const { ethers } = require("hardhat");


const WETH_ADDY = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
let weth_contract = new ethers.Contract(WETH_ADDY,erc20ABI);
import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";

if(!process.env.DEPLOY_KEY || !process.env.BSCSCAN_TOKEN || !process.env.MAIN_DEPLOY_KEY) 
  throw new Error("DEPLOY_KEY is not set");

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks:{
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: [process.env.DEPLOY_KEY]
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      accounts: [process.env.MAIN_DEPLOY_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_TOKEN
  }

};

export default config;

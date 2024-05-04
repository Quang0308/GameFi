import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    dev: {
      url: 'http://localhost:8000',
      gasPrice: 20,
      accounts: {
        mnemonic: process.env.MNEMONIC,
        count: 10
      },
    },
    bsctest: {
      url: " https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [process.env.PRIV_KEY as string],
      // gasPrice: 100000000000,
      // blockGasLimit: 10000000
    },
    polygontest: {
      url: " https://polygon-mumbai.g.alchemy.com/v2/bqplRLkNDIfSRkZETh6ifKTBZHfauIzJ",
      accounts: [process.env.PRIV_KEY as string],
      // gas: 750000,
      // gasPrice: 10000000,
      // blockGasLimit: 10000000
    },
  },
  etherscan: {
    apiKey: process.env.API_KEY,
  },
};

export default config;

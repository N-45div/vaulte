require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Check for private key
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    ethena: {
      url: "https://testnet.rpc.ethena.fi",
      chainId: 52085143,
      accounts: [PRIVATE_KEY],
      verify: {
        etherscan: {
          apiUrl: "https://testnet.explorer.ethena.fi/",
        }
      }
    }
  }
};

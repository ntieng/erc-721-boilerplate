import * as dotenv from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "@openzeppelin/hardhat-upgrades"; // for upgradeable contract only
import "hardhat-contract-sizer";

dotenv.config();

// How to create hardhat task: https://hardhat.org/guides/create-task.html
task("list-accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

task("task-with-param-test", "Test hardhat task with parameters")
    .addParam("requiredparam", "This is required param, fail will cause exception")
    .addOptionalParam("optionalparam", "This is optional param, can ignore")
    .setAction(async (taskArgs, hre) => {
        // Show task usage: npx hardhat help task-with-param-test
        // Sample usage: npx hardhat task-with-param-test --requiredparam YourInputHere
        console.log("Your input for required_param:", taskArgs.requiredparam);
        console.log("Your input for optional_param:", taskArgs.optionalparam);
    });

task("network-wallet-balance", "Prints the wallet balance of default network")
    .addOptionalParam("address", "The wallet address, if not set, default wallet address from network config will be use")
    .setAction(async (taskArgs, hre) => {
        let address: string | undefined = taskArgs.address;

        if (!address) {
            console.log("No wallet address given, using default wallet address from network config.");
        }

        address = hre.network.config.from;

        if (!address) {
            console.log("Address not set on network config.");
        } else {
            const balance = await hre.ethers.provider.getBalance(address!);

            console.log("Network name:", hre.network.name);
            console.log("Wallet address:", address);
            console.log("Wallet balance:", `${hre.ethers.utils.formatEther(balance)} ether`);
        }
    });

const config: HardhatUserConfig = {
    defaultNetwork: "localhost", // Default: hardhat
    networks: {
        localhost: {
            url: "http://127.0.0.1:7545",
            from: process.env.WALLET_LOCAL,
        },
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts: [`0x${process.env.WALLET_UAT_PK}`]
        },
        bsctest: {
            url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
            accounts: [`0x${process.env.WALLET_UAT_PK}`],
            gas: 8500000
        },
        // anistictest: {
        //     url: `https://testnet-rpc.anisticnetwork.net`,
        //     accounts: [`0x${process.env.WALLET_UAT_PK}`],
        //     gas: 8500000
        // },
        // anisticprod: {
        //     url: `https://mainnet-rpc.anisticnetwork.com`,
        //     accounts: [`0x${process.env.WALLET_PROD_PK}`],
        //     gas: 8500000
        // },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
        // apiKey: process.env.BSCSCAN_API_KEY
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS === "Y",
        currency: "USD",
        // gasPriceApi: process.env.GAS_REPORTER_API,
        token: process.env.GAS_REPORTER_TOKEN,
        coinmarketcap: process.env.COIN_MARKET_CAP_API
    },
    contractSizer: {
        alphaSort: true,
        disambiguatePaths: false,
        runOnCompile: true,
        strict: true
    },
    solidity: {
        version: "0.8.9",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    }
};

export default config;

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-network-helpers";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-gas-reporter";
import "hardhat-watcher";
import "hardhat-deploy";
import "hardhat-contract-sizer";
import "solidity-coverage";
import "dotenv/config";
import "@primitivefi/hardhat-dodoc";
import "@nomicfoundation/hardhat-foundry";
import "@tenderly/hardhat-tenderly";
import "hardhat-tracer";
import "@openzeppelin/hardhat-upgrades";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const MUMBAI_API_KEY = process.env.MUMBAI_API_KEY;
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
const BSC_API_KEY = process.env.BSC_API_KEY;
const AVALANCHE_API_KEY = process.env.AVALANCHE_API_KEY;
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

const accounts = [DEPLOYER_PRIVATE_KEY as string];

enum CHAIN_IDS {
  goerli = 5,
  hardhat = 31337,
  kovan = 42,
  mainnet = 1,
  rinkeby = 4,
  ropsten = 3,
  bsc = 97,
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.23",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          outputSelection: {
            "*": {
              "*": ["storageLayout"],
            },
          },
        },
      },
      {
        version: "0.6.12",
      },
      {
        version: "0.4.17",
      },
      {
        version: "0.5.16",
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ["local"],
      allowUnlimitedContractSize: true,
    },
    hardhat: {
      allowUnlimitedContractSize: true,
      blockGasLimit: 10000000,
      chainId: 31337,
      live: false,
      saveDeployments: true,
      tags: ["test", "local"],
      // Solidity-coverage overrides gasPrice to 1 which is not compatible with EIP1559
      hardfork: process.env.CODE_COVERAGE ? "berlin" : "london",
      forking: {
        enabled: process.env.FORKING === "true",
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        blockNumber: 15759970,
      },
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 1,
      forking: {
        enabled: process.env.FORKING === "true",
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        blockNumber: 11829739,
      },
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 3,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 4,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      // url: 'https://rpc.ankr.com/eth_goerli',
      accounts,
      chainId: 5,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 42,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    moonbase: {
      url: "https://rpc.testnet.moonbeam.network",
      accounts,
      chainId: 1287,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    binance: {
      url: "https://aged-withered-flower.bsc.quiknode.pro/7af22bf6a00dc835df81b02bd1549ffe37fd98f5/",
      accounts,
      chainId: 56,
      live: true,
      saveDeployments: true,
    },
    binancetest: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts,
      chainId: 97,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    polygon: {
      url: "https://purple-cosmological-wish.matic.quiknode.pro/091e70dee18c00bcf7033e816270edd71e9fbeb5/",
      accounts,
      chainId: 137,
      live: true,
      saveDeployments: true,
    },
    fantom: {
      url: "https://rpcapi.fantom.network",
      accounts,
      chainId: 250,
      live: true,
      saveDeployments: true,
    },
    fantomtest: {
      url: "https://rpc.testnet.fantom.network/",
      accounts,
      chainId: 4002,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    avalanche: {
      url: "https://ava.spacejelly.network/api/ext/bc/C/rpc",
      accounts,
      chainId: 43114,
      live: true,
      saveDeployments: true,
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts,
      chainId: 43113,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/lwU_Wuq0git1ayevwwv_RULuL4iFIyId",
      accounts,
      chainId: 80001,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    huobi: {
      url: "https://http-mainnet.hecochain.com",
      accounts,
      chainId: 128,
      live: true,
      saveDeployments: true,
    },
    huobitest: {
      url: "https://http-testnet.hecochain.com",
      accounts,
      chainId: 256,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    okex: {
      url: "http://okexchain-rpc1.okex.com:26659",
      accounts,
      chainId: 66,
      live: true,
      saveDeployments: true,
    },
    okextest: {
      url: "http://okexchaintest-rpc1.okex.com:26659",
      accounts,
      chainId: 65,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    xdai: {
      url: "https://rpc.xdaichain.com",
      accounts,
      chainId: 100,
      live: true,
      saveDeployments: true,
    },
    tomo: {
      url: "https://rpc.tomochain.com",
      accounts,
      chainId: 88,
      live: true,
      saveDeployments: true,
    },
    tomotest: {
      url: "https://rpc.testnet.tomochain.com",
      accounts,
      chainId: 89,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    moonbeam: {
      url: "https://rpc.api.moonbeam.network",
      accounts,
      chainId: 1284,
      live: true,
      saveDeployments: true,
    },
    arbitrumgoerli: {
      url: "https://side-wandering-hexagon.arbitrum-goerli.quiknode.pro/1e4ef218c4e8b5772a964f385de88b9063ad9421/",
      accounts,
      chainId: 421613,
      //accounts: [GOERLI_TESTNET_PRIVATE_KEY]
    },
    arbitrumone: {
      url: "https://arb1.arbitrum.io/rpc",
      //accounts: [ARBITRUM_MAINNET_TEMPORARY_PRIVATE_KEY]
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY || "",
      bscTestnet: BSC_API_KEY || "",
      bsc: BSC_API_KEY || "",
      polygon: POLYGON_API_KEY || "",
      // mumbai: MUMBAI_API_KEY || '',
      // avalanche: AVALANCHE_API_KEY || '',
    },
  },
  watcher: {
    compile: {
      tasks: ["compile"],
      files: ["./contracts"],
      verbose: true,
    },
    test: {
      tasks: [
        {
          command: "test",
          params: { testFiles: ["test/poolWithVesting.spec.ts"] },
        },
      ],
      files: ["./test/**/*"],
      verbose: true,
    },
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: false,
    strict: true,
    // only: [':Greeter$'],
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  dodoc: {
    runOnCompile: false,
    debugMode: true,
    include: ["contracts/core"],
  },
};

export default config;

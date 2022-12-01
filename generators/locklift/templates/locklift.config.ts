import { LockliftConfig } from 'locklift';
import { FactorySource } from './build/factorySource';
import { SimpleGiver<% if (giverTypes.includes('GiverWallet')) { %>, GiverWallet<% } %><% if (giverTypes.includes('WalletV3')) { %>, WalletV3<% } %> } from './giverSettings';

declare global {
  const locklift: import('locklift').Locklift<FactorySource>;
}

const LOCAL_NETWORK_ENDPOINT = 'http://localhost/graphql';

const config: LockliftConfig = {
  compiler: {
    // Specify path to your TON-Solidity-Compiler
    // path: "/mnt/o/projects/broxus/TON-Solidity-Compiler/build/solc/solc",

    // Or specify version of compiler
    version: '<%= compiler %>',
    <% if (externalContracts) { %>
    // Specify config for extarnal contracts as in exapmple
    externalContracts: {
      "node_modules/@itgold/everscale-tip/contracts/TIP4_3/compiled": [
        "Index",
        "IndexBasis",
      ],
    },
    <% } %>
  },
  linker: {
    // Specify path to your stdlib
    // lib: "/mnt/o/projects/broxus/TON-Solidity-Compiler/lib/stdlib_sol.tvm",
    // // Specify path to your Linker
    // path: "/mnt/o/projects/broxus/TVM-linker/target/release/tvm_linker",

    // Or specify version of linker
    version: '<%= linker %>',
  },
  networks: {
    local: {
      // Specify connection settings for https://github.com/broxus/everscale-standalone-client/
      connection: {
        id: 1,
        group: 'localnet',
        type: 'graphql',
        data: {
          endpoints: [LOCAL_NETWORK_ENDPOINT],
          latencyDetectionInterval: 1000,
          local: true,
        },
      },
      // This giver is default local-node giverV2
      giver: {
        // Check if you need provide custom giver
        giverFactory: (ever, keyPair, address) =>
          new SimpleGiver(ever, keyPair, address),
        address:
          '0:ece57bcc6c530283becbbd8a3b24d3c5987cdddc3c8b7b33be6e4a6312490415',
        key: '172af540e43a524763dd53b26a066d472a97c4de37d5498170564510608250c3',
      },
      tracing: {
        endpoint: LOCAL_NETWORK_ENDPOINT,
      },
      keys: {
        // Use everdev to generate your phrase
        // !!! Never commit it in your repos !!!
        // phrase: "action inject penalty envelope rabbit element slim tornado dinner pizza off blood",
        amount: 20,
      },
    }, <% if (networks.has('testnet')) { %>
    testnet: {
      // Specify connection settings for https://github.com/broxus/everscale-standalone-client/
      connection: <% if ((blockchain == "venom")) { %>{
        group: 'testnet',
        type: 'jrpc',
        data: {
          endpoint: 'https://jrpc-testnet.venom.foundation/rpc',
        },
      },<% } %><% if (blockchain == "everscale") { %>'testnet',<% } %>
      // This giver is default Wallet
      giver: {
        // Check if you need provide custom giver
        giverFactory: (ever, keyPair, address) =>
          new <%= networks.get('testnet').giver.type %>(ever, keyPair, address),
        address: '<%= networks.get('testnet').giver.address %>',
        key: '<%= networks.get('testnet').giver.privateKey %>',
      },
      keys: {
        // Use everdev to generate your phrase
        // !!! Never commit it in your repos !!!
        phrase: '<%= networks.get('testnet').giver.phrase %>',
        amount: 20,
      },
    },<% } %><% if (networks.has('mainnet')) { %>
    mainnet: {
      // Specify connection settings for https://github.com/broxus/everscale-standalone-client/
      connection: <% if ((blockchain == "venom")) { %>{
        group: 'testnet',
        type: 'jrpc',
        data: {
          endpoint: 'https://jrpc.venom.foundation/rpc',
        },
      },<% } %><% if (blockchain == "everscale") { %>'mainnet',<% } %>
      // This giver is default Wallet
      giver: {
        // Check if you need provide custom giver
        giverFactory: (ever, keyPair, address) =>
          new <%= networks.get('mainnet').giver.type %>(ever, keyPair, address),
        address: '<%= networks.get('mainnet').giver.address%>',
        key: '<%= networks.get('mainnet').giver.privateKey%>',
      },
      keys: {
        // Use everdev to generate your phrase
        // !!! Never commit it in your repos !!!
        phrase: '<%= networks.get('mainnet').giver.phrase %>',
        amount: 20,
      },
    },<% } %>
  },
  mocha: {
    timeout: 2000000,
  },
};

export default config;

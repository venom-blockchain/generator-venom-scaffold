TIP3 Token

# About the project
This project helps you to create your first [TIP-3](https://docs.venom.foundation/build/development-guides/how-to-create-your-own-fungible-tip-3-token/fungible-tokens-in-venom-network) token for Venom blockchain.

What is TIP-3?
Just as ERC-20 is the most popular standard in the Ethereum network, TIP-3 assumes the same role in the Venom network. TIP-3 was designed to match the distributed system design of the Venom network and is cost-effective for its fee-paying model.

TIP-3 provides the following functionalities
 - transfer tokens from one account to another
 - get the current token balance of an account
 - get the total supply of the token available on the network
 - mint and burn tokens

You can find more info about TIP3 token in our [documentation](https://docs.venom.foundation/build/development-guides/how-to-create-your-own-fungible-tip-3-token/fungible-tokens-in-venom-network)

> **NOTE:** We highly recommend using [locklift](https://github.com/broxus/locklift/) as a development environment analog of  Hardhat or Truffle in Venom/Everscale world.

# Table of Contents
- [About the project](#about-the-project)
- [Table of Contents](#table-of-contents)
- [Project structure](#project-structure)
  - [`./contracts`](#contracts)
  - [`./giverSettings`](#giversettings)
  - [`locklift.config.ts`](#lockliftconfigts)
  - [`scripts`](#scripts)
  - [`test`](#test)
- [Getting started](#getting-started)
  - [Build contracts](#build-contracts)
  - [Test contracts](#test-contracts)
  - [Deploy contracts](#deploy-contracts)
  - [Mint/Burn tokens](#mintburn-tokens)
  - [Local node](#local-node)
- [Next steps](#next-steps)

# Project structure
Below you will find info about the project structure and the purpose of the main directories and files.
## `./contracts`
Directory for smart contracts.

## `./giverSettings`
Directory where you can set up your custom giver type or use one of the defaults. Giver - it's an account that you will use to fund your smart contracts. There are several types of givers that you can use (SimpleWallet, GiverWallet, WalletV3). You can create your giver type. To do this, you should deploy a contract that implements `Giver interface`. 
The easiest way to setting up giver is to use a WalletV3 account. This type of account is used in the venom wallet. So you can create a new account with venom extension and use it as a giver.

## `locklift.config.ts`
Locklift config file. You can find the basic layout [here](https://docs.venom.foundation/build/development-guides/setting-up-the-venom-smart-contract-development-environment/#configuration)

## `scripts`
Directory for migrations scripts to deploy and set up your contracts.

## `test`
Directory for tests.

# Getting started
After setting up the project with `yo venom-scaffold`, you should already have a project ready for testing and deployment. 

First, let's check configs at `locklift.config.ts` [file](#lockliftconfigts). Be sure that you provide the correct settings for all required networks and [givers](#giversettings). 

Further, let's verify the token's settings in `scripts/00-deploy.ts` file:
```
ROOT_OWNER_ADDRESS - Address of the contract root owner (String)
REMAINING_GAS_TO - `Address to send the remaining gas (String)
NAME - The name of your token. For example `'Awesome TIP3 token'` (String)
SYMBOL - The symbol of your token. For example `'AWESOME-TIP3-TOKEN'` (String)
INITIAL_SUPPLY_TO - Address of initial token supply recipient (String)
INITIAL_SUPPLY - The number of tokens that will be issued immediately after deployment (String)
DECIMALS - The number of decimals that your token should have (Number)
DISABLE_MINT - Disables additional emission of tokens (Boolean)
DISABLE_BURN_BY_ROOT - Disables tokens burning (Boolean)
PAUSE_BURN - Temporarily disables token burning (Boolean)
```

After you check all settings, we are ready to [build](#build-contracts), [test](#test-contracts), and [deploy](#deploy-contracts) contracts.

## Build contracts
```bash
<%= pkgManager %> run build
```

## Test contracts
To test contracts locally, we need to run the [local node](#local-node).
```bash 
<%= pkgManager %> run run:local-node
```

To run tests on the venom testnet, ensure you have added a giver for that network in `locklift.config.ts`.

```bash
<%= pkgManager %> run test:local
<%= pkgManager %> run test:testnet
```

## Deploy contracts
```bash
# deploy on the testnet
<%= pkgManager %> run deploy:testnet

# deploy on the mainnet
<%= pkgManager %> run deploy:mainnet
```

## Mint/Burn tokens
Additionally, you can run scripts to mint or burn tokens if you specify `DISABLE_MINT` and `DISABLE_BURN_BY_ROOT` to `false`.
```bash
# mint
<%= pkgManager %> run mint:testnet
<%= pkgManager %> run mint:mainnet

# burn
<%= pkgManager %> run burn:testnet
<%= pkgManager %> run burn:mainnet
```

## Local node
[Local node](https://hub.docker.com/r/tonlabs/local-node) is a pre-configured Docker image with a Ganache-like local blockchain designed for dapp debugging and testing. 

The container exposes the specified 80 port with nginx, which proxies requests to /graphql to GraphQL API. You can access graphql endpoint at `http://localhost/graphql`

```bash
# run
<%= pkgManager %> run run:local-node

# stop
<%= pkgManager %> run stop:local-node
```

# Next steps
You can check our [documentation about TIP3 tokens](https://docs.venom.foundation/build/development-guides/how-to-create-your-own-fungible-tip-3-token/venom-in-action/simple-tokensale), to find more tutorials
TIP4 Token (NFT)

# About the project

This project helps you to create your first [TIP-4 (NFT)](https://docs.venom.foundation/build/development-guides/how-to-create-your-own-non-fungible-tip-4-token/non-fungible-tokens-in-venom-network) token for Venom blockchain.

What is TIP-4?
Same to Ethereum ERC-721 standard, TIP-4 provides similar functionality for Venom Blockchain. As well as TIP-3, TIP-4 was designed to match the distributed system design of the Venom network. It is cost-effective for its fee-paying model.

TIP-4 provides the following functionality:

- minting and burning NFTs
- transferring NFTs from one account to another
- selling your NFTs

You can find more info about TIP4 token in our [documentation](https://docs.venom.foundation/build/development-guides/how-to-create-your-own-non-fungible-tip-4-token/non-fungible-tokens-in-venom-network). Here you can find detailed information about [TIP4-1](https://github.com/nftalliance/docs/blob/main/src/standard/TIP-4/1.md),[TIP4-2](https://github.com/nftalliance/docs/blob/main/src/standard/TIP-4/2.md), [TIP4-3](https://github.com/nftalliance/docs/blob/main/src/standard/TIP-4/3.md) standards

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
  - [Mint NFT](#mint-nft)
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

After you check up all settings, we are ready to [build](#build-contracts), [test](#test-contracts), [deploy](#deploy-contracts) and [mint](#mint-nft) NFT.

## Build contracts

```bash
<%= pkgManager %> run build
```

## Test contracts

To test contracts locally, we need to run the [local node](#local-node).

```bash
<%= pkgManager %> run run:local-node
```

To run tests on the venom testnet, make sure you have added a giver for that network in `locklift.config.ts`.

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

## Mint NFT

```bash
# mint on the testnet
<%= pkgManager %> run mint:testnet

# deploy on the mainnet
<%= pkgManager %> run mint:mainnet

```

## Local node

[Local node](https://hub.docker.com/r/tonlabs/local-node). is a pre-configured Docker image with a Ganache-like local blockchain that is designed for dapp debugging and testing.

Container exposes the specified 80 port with nginx which proxies requests to /graphql to GraphQL API. You can access graphql endpoint at `http://localhost/graphql`

```bash
# run
<%= pkgManager %> run run:local-node

# stop
<%= pkgManager %> run stop:local-node
```

# Next steps

You can check our [documentation about TIP4 tokens](https://docs.venom.foundation/build/development-guides/how-to-create-your-own-non-fungible-tip-4-token/venom-in-action/simple-nft-auction), to find more tutorials

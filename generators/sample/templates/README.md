Sample project

# About the project

This project helps you to create your first contract for Venom blockchain.
For the next steps, you can follow [our tutorials](https://docs.venom.foundation/build/development-guides/).

> **NOTE:** We highly recommend using [locklift](https://github.com/broxus/locklift/) as a development environment analog of Hardhat or Truffle in Venom/Everscale world.

# Table of Contents

- [About the project](#about-the-project)
- [Table of Contents](#table-of-contents)
- [Project structure](#project-structure)
  - [`./contracts`](#contracts)
  - [`locklift.config.ts`](#lockliftconfigts)
  - [`scripts`](#scripts)
  - [`test`](#test)
- [Getting started](#getting-started)
  - [Build contracts](#build-contracts)
  - [Tests](#tests)
  - [Deploy](#deploy)
    - [Local node](#local-node)

# Project structure

Below you will find info about the project structure and the purpose of the main directories and files.

## `./contracts`

Directory for smart contracts.

## `locklift.config.ts`

Locklift config file. You can find the basic layout [here](https://docs.venom.foundation/build/development-guides/setting-up-the-venom-smart-contract-development-environment/#configuration)

## `scripts`

Directory for migrations scripts to deploy and set up your contracts.

## `test`

Directory for tests.

# Getting started

After setting up the project with `yo venom-scaffold`, you should already have a project ready for testing and deployment.

First, let's check configs at `locklift.config.ts` [file](#lockliftconfigts). Be sure that you provide the correct settings for all required networks.

## Build contracts

```bash
<%= pkgManager %> run build
```

## Tests

To test contracts locally, we need to run the [local node](#local-node).

```bash
<%= pkgManager %> run run:local-node
```

To run tests on the venom testnet, make sure you have added a giver for that network in `locklift.config.ts`.

```bash
<%= pkgManager %> run test:local
<%= pkgManager %> run test:testnet
```

## Deploy

```bash
# deploy on the testnet
<%= pkgManager %> run deploy:testnet

# deploy on the mainnet
<%= pkgManager %> run deploy:mainnet
```

### Local node

[Local node](https://hub.docker.com/r/tonlabs/local-node) is a pre-configured Docker image with a Ganache-like local blockchain designed for dapp debugging and testing.

Container exposes the specified 80 port with nginx which proxies requests to /graphql to GraphQL API. You can access graphql endpoint at `http://localhost/graphql`

```bash
# run
<%= pkgManager %> run run:local-node

# stop
<%= pkgManager %> run stop:local-node
```

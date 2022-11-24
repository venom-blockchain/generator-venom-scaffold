<h1 align="center">
 <img src="logo.png" />
</h1>

<!-- ABOUT THE PROJECT -->
# About The Project
The Venom scaffold is inspired by the Truffle boxes and aims to help users create a project ready to test, deploy, and execute arbitrary scripts to develop smart contracts on Venom-like blockchains. Under the hood, it's a [yeoman](http://yeoman.io/) generator.

You can find a list of available templates running:
```bash
yo venom-scaffold --help  
```

Or run the cli and choose the project template on the first step.
```bash
yo venom-scaffold <new-project-path>
```

To create your first project, we have a [tutorial](#tip3-tutorial). Follow the instructions and make your first TIP3 token (TIP3 is a token standard, like ERC20 in Ethereum world).


# Table of Contents
- [About The Project](#about-the-project)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
  - [Get help](#get-help)
  - [Configuration](#configuration)
- [TIP3 tutorial](#tip3-tutorial)
  - [Choose a project template](#choose-a-project-template)
  - [Set up package manager and package.json](#set-up-package-manager-and-packagejson)
  - [Configure TIP3 token](#configure-tip3-token)
    - [Enter the address of the contract root owner](#enter-the-address-of-the-contract-root-owner)
    - [Enter the name of your token](#enter-the-name-of-your-token)
    - [Enter the symbol of your token](#enter-the-symbol-of-your-token)
    - [Specify the number of tokens that will be issued immediately after deployment](#specify-the-number-of-tokens-that-will-be-issued-immediately-after-deployment)
    - [Enter the address to send initially minted tokens](#enter-the-address-to-send-initially-minted-tokens)
    - [How many decimals will the token have?](#how-many-decimals-will-the-token-have)
    - [Disable additional emission of tokens?](#disable-additional-emission-of-tokens)
    - [Disable tokens burn?](#disable-tokens-burn)
    - [Pause ability to burn tokens? Available only if tokens burning were enabled in the previous step](#pause-ability-to-burn-tokens-available-only-if-tokens-burning-were-enabled-in-the-previous-step)
    - [Enter the address to send remaining gas](#enter-the-address-to-send-remaining-gas)
  - [Configure locklift development environment](#configure-locklift-development-environment)
    - [Enter compiler version](#enter-compiler-version)
    - [Enter linker version](#enter-linker-version)
    - [Select blockchain (Use arrow keys)](#select-blockchain-use-arrow-keys)
    - [Giver type (testnet | mainnet)](#giver-type-testnet--mainnet)
    - [Giver address (testnet | mainnet)](#giver-address-testnet--mainnet)
    - [Giver seed phrase (testnet | mainnet)](#giver-seed-phrase-testnet--mainnet)
    - [Giver privateKey (testnet | mainnet)](#giver-privatekey-testnet--mainnet)
  - [Run project](#run-project)


<!-- GETTING STARTED -->
# Installation
```bash
# install [yo](https://www.npmjs.com/package/yo)
npm install --global yo

# clone the repo (in future the npm package will be created)
git@github.com:venom-blockchain/generator-venom-scaffold.git
cd venom-scaffold

# install all requirement dependencies
npm install 

# build
npm build

# symlink a package folder 
npm link
```

# Usage
The simplest way - is to run cmd and answer the prompt questions.
```bash
# run cmd
❯ yo venom-scaffold <new-project-path>
```
After that, go to the `<new-project-path>` and follow the instructions in the README.md


## Get help
You can run the generator with the help option to get more info about usage.
Also, you can get a help message for the sub-generator.
```bash
# get help for venom-scaffold
❯ yo venom-scaffold --help

# get help for venom-scaffold sub-generator
❯ yo venom-scaffold:tip3 --help
```

## Configuration
To set up a project, you can answer the prompt questions, use options or config file.

You can find the available options with cmd `yo venom-scaffold --help`. To find options for sub-generators, use `yo venom-scaffold:<sub-generator> --help`. For example, `yo venom-scaffold:tip3 --help`.

All options can also be defined using the config file.

For example, let's set up a project with config.json file.
First, we need to get all available options:
```bash
❯ yo venom-scaffold --help
Usage:
  yo venom-scaffold:app [<path>] [options]

Options:
  -h,   --help           # Print the generator's options and usage
        --skip-cache     # Do not remember prompt answers                                    Default: false
        --skip-install   # Do not automatically install dependencies                         Default: false
        --force-install  # Fail on install dependencies error                                Default: false
        --ask-answered   # Show prompts for already configured options                       Default: false
        --config         # Path to the config file
        --locklift       # Use Locklift as a development environment?                        Default: true
        --pkg-manager    # Package manager to use (npm|yarn)
  -t,   --template       # Template to create project: 'sample' | 'tip3' | 'tip4' | 'empty'

Arguments:
  path  # Path to the project folder  Type: String  Required: false

Description:
  The Venom scaffold is inspired by the Truffle boxes and aims to help users create a project ready to test, deploy, and execute arbitrary scripts to develop smart contracts on Venom-like blockchains.

Subgenerators:
  yo venom-scaffold:sample [<path>] [options]
  yo venom-scaffold:tip3   [<path>] [options]
  yo venom-scaffold:tip4-1 [<path>] [options]
```

Let's create `config.json` file and specify options:
```json
{  
  "locklift": true,
  "pkg-manager": "npm",
  "template": "tip3",
  "path": "my-first-tip3-token"
}
```

To provide config, use options `--config`
```bash 
yo venom-scaffold --config config.json
```

You can configure sub-generators as well. To get a list of options, you can run cmd:
```bash
❯ yo venom-scaffold:tip3 --help
Usage:
  yo venom-scaffold:tip3 [<path>] [options]

Options:
  -h,   --help                # Print the generator's options and usage
        --skip-cache          # Do not remember prompt answers                                         Default: false
        --skip-install        # Do not automatically install dependencies                              Default: false
        --force-install       # Fail on install dependencies error                                     Default: false
        --ask-answered        # Show prompts for already configured options                            Default: false
        --config              # Path to the config file
        --locklift            # Use Locklift as a development environment?                             Default: true
        --pkg-manager         # Package manager to use (npm|yarn)
        --compiler            # Compiler version                                                       Default: 0.59.0
        --linker              # Linker version                                                         Default: 0.15.48
        --root-owner-address  # Address of the contract root owner
        --token-name          # The name of your token
        --token-symbol        # The symbol of your token
        --initial-supply      # The number of tokens that will be issued immediately after deployment
        --initial-supply-to   # Address of initial token supply recipient
        --decimals            # The number of decimals that your token should have
        --disable-mint        # Disables additional emission of tokens
        --disable-burn        # Disables tokens burning
        --pause-burn          # Temporarily disables token burning
        --remaining-gas-to    # Address to send the remaining gas

Arguments:
  path  # Path to the project folder  Type: String  Required: false
```

# TIP3 tutorial
First, install [yo](https://www.npmjs.com/package/yo), clone venom-scaffold generator, install dependencies and create a symlink to a package folder. Follow the [installation instructions](#installation) to pass this step.


Awesome! Now we are ready to create your first TIP3 token.

Cli takes <path> as an argument, indicating which directory to create a new project. By default, it is the current directory.

In this tutorial, we will create a project in the directory `~/projects/first-tip3-token`. You can choose any directory.

```bash
yo venom-scaffold ~/projects/first-tip3-token
```

> **NOTE:** To navigate over list use arrows. To submit answer use `enter`.

> **NOTE:** If you don't ready to answer some questions, you can leave them empty. A default or empty value will be used in this case.


Now you should answer some questions to create a project which will fit you. Questions grouped by topic:
## Choose a project template
In this tutorial, we will create TIP3 token, so choose a `Fungible token (TIP3)` at this step. 

## Set up package manager and package.json
In this tutorial, we will use npm as a package manager. You can choose yarn as well. Next, you should answer questions to set up `package.json`.

## Configure TIP3 token
In this section, we will configure our token. Let's take a look at each question in more detail.

### Enter the address of the contract root owner
You can create your account with [Venom wallet]("https://venom.foundation/wallet"). The contract root owner can deploy new token wallets and mint/burn tokens.
> `0:123...baa`

### Enter the name of your token
Name - is a string of arbitrary length, which will be used as a token name.
> `First Venom Token`

### Enter the symbol of your token
A symbol is a short name of your token.
> `FVT`

### Specify the number of tokens that will be issued immediately after deployment
Amount of tokens that will be minted immediately after deployment.
> `1000000000`

### Enter the address to send initially minted tokens
Address of initial token supply recipient. 
> `0:123...baa`

### How many decimals will the token have?
The number of decimals that your token should have. 
> `18`

### Disable additional emission of tokens?
If additional emission of tokens is disabled, you will not have the ability to mint tokens after initial minting
> `No`

### Disable tokens burn?
If tokens burning are disabled, you will not have the ability to burn tokens.
> `No`

### Pause ability to burn tokens? Available only if tokens burning were enabled in the previous step
Temporarily disables token burning. In the future, you can enable it with the method `setBurnPaused({answerId:0, paused:false})`.
> `No`

### Enter the address to send remaining gas
All remaining gas will be sent to this address.  
> `0:123...baa`

## Configure locklift development environment
> **NOTE:**  [Locklift](https://github.com/broxus/locklift/) is a development environment like Hardhat or Truffle. We highly recommend using it as a developer tool. 
### Enter compiler version
As a compiler, we use [TON-Solidity-Compiler](https://github.com/tonlabs/TON-Solidity-Compiler) - port of the Solidity smart-contract compiler generating TVM bytecode for the Venom blockchain. You can find compiler API <a href="https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md#solidity-runtime-errors">here</a>. For TIP3 contracts, we recommend to use version `0.59.0`
> `0.59.0`

### Enter linker version
[Linker](https://github.com/tonlabs/TVM-linker) takes [TVM](https://test.ton.org/tvm.pdf) assembly source code of TON smart contract, compiles it and links its parts, adds standard selector and runtime and stores it into binary TVC file.
> `0.15.48`

### Select blockchain (Use arrow keys)
Venom and Everscale use the same virtual machine, compilers, and linkers. So you can deploy contracts in Venom just like in Everscale.
> `Venom` 

### Giver type (testnet | mainnet)
Giver - it's an account that you will use to fund your smart contracts. There are several types of givers that you can use (SimpleWallet, GiverWallet, WalletV3). You can create your giver type. To do this, you need to deploy a contract that implements [Giver interface](https://github.com/broxus/locklift/blob/master/src/internal/factory/giver.ts). 
The easiest way to setting up giver is to use a WalletV3 account. The venom wallet uses this type of account. So you can create a new account with venom wallet and use it as a giver.
> `WalletV3`

### Giver address (testnet | mainnet)
Address of the giver contract.
> `0:123...baa`

### Giver seed phrase (testnet | mainnet)
Seed phrase of the giver account. You can omit empty this field and provide it manually in `locklift.config.ts` later.
> `action inject penalty envelope rabbit element slim tornado dinner pizza off blood`

### Giver privateKey (testnet | mainnet)
The private key of the giver account. You can omit empty this field and provide it manually in `locklift.config.ts` later.
> `172af540e43a524763dd53b26a066d472a97c4de37d5498170564510608250c3`


## Run project
Fantastic, the project is ready! Follow the instructions in the project README to find the next steps.

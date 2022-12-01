import { expect } from "chai";
import { Account } from "everscale-standalone-client/nodejs";
import { Contract, WalletTypes, zeroAddress } from "locklift";
import * as nt from "nekoton-wasm";

import { FactorySource } from "../build/factorySource";

const NAME = "Awesome TIP3 token";
const SYMBOL = "AWESOME-TIP3-TOKEN";
const INITIAL_SUPPLY = 1000000000;
const ADDITIONAL_MINT = 1000000000;
const BURN_AMOUNT = 1000000000;
const DECIMALS = 6;
const DISABLE_MINT = false;
const DISABLE_BURN_BY_ROOT = false;
const PAUSE_BURN = false;

let tokenRoot: Contract<FactorySource["TokenRoot"]>;
let owner: Account;
let ownerKeys: nt.Ed25519KeyPair;

describe("Test Awesome token deployment, minting and burning", async function () {
  before(async () => {
    ownerKeys = nt.ed25519_generateKeyPair();
    locklift.keystore.addKeyPair(ownerKeys);
    const { account } = await locklift.factory.accounts.addNewAccount({
      type: WalletTypes.WalletV3,
      publicKey: ownerKeys.publicKey,
      value: locklift.utils.toNano(2),
    });
    owner = account;
  });
  it("Load TokenRoot contract factory", async function () {
    const tokenRootSampleData = locklift.factory.getContractArtifacts("TokenRoot");
    expect(tokenRootSampleData.code).not.to.equal(undefined, "Code should be available");
    expect(tokenRootSampleData.abi).not.to.equal(undefined, "ABI should be available");
    expect(tokenRootSampleData.tvc).not.to.equal(undefined, "tvc should be available");
  });
  it("Load TokenWallet contract factory", async function () {
    const tokenWalletSampleData = locklift.factory.getContractArtifacts("TokenWallet");
    expect(tokenWalletSampleData.code).not.to.equal(undefined, "Code should be available");
    expect(tokenWalletSampleData.abi).not.to.equal(undefined, "ABI should be available");
    expect(tokenWalletSampleData.tvc).not.to.equal(undefined, "tvc should be available");
  });
  it(`Deploy TokenRoot contract`, async function () {
    this.timeout(60000);

    const tokenWalletContract = locklift.factory.getContractArtifacts("TokenWallet");

    const { contract } = await locklift.factory.deployContract({
      contract: "TokenRoot",
      publicKey: ownerKeys.publicKey,
      initParams: {
        name_: NAME,
        symbol_: SYMBOL,
        decimals_: DECIMALS,
        rootOwner_: owner.address,
        walletCode_: tokenWalletContract.code,
        randomNonce_: locklift.utils.getRandomNonce(),
        deployer_: zeroAddress,
      },
      constructorParams: {
        initialSupplyTo: owner.address,
        initialSupply: INITIAL_SUPPLY,
        deployWalletValue: locklift.utils.toNano(0.1),
        mintDisabled: DISABLE_MINT,
        burnByRootDisabled: DISABLE_BURN_BY_ROOT,
        burnPaused: PAUSE_BURN,
        remainingGasTo: owner.address,
      },
      value: locklift.utils.toNano(2),
    });

    tokenRoot = contract;
    const { value0: balance } = await tokenRoot.methods.totalSupply({ answerId: 0 }).call();

    expect(Number(balance)).equal(INITIAL_SUPPLY, "Contract total supply should be the same as initial supply");
  });
  it("Mint tokens", async function () {
    this.timeout(30000);
    await tokenRoot.methods
      .mint({
        amount: ADDITIONAL_MINT,
        recipient: owner.address,
        deployWalletValue: locklift.utils.toNano(0.1),
        notify: false,
        payload: "",
        remainingGasTo: owner.address,
      })
      .send({
        from: owner.address,
        amount: locklift.utils.toNano(2),
      });
    const { value0: balance } = await tokenRoot.methods.totalSupply({ answerId: 0 }).call();

    expect(Number(balance)).equal(
      INITIAL_SUPPLY + ADDITIONAL_MINT,
      "Contract total supply should be the same as initial supply",
    );
  });
  it("Burn tokens", async function () {
    this.timeout(30000);
    await tokenRoot.methods
      .burnTokens({
        amount: BURN_AMOUNT,
        walletOwner: owner.address,
        callbackTo: owner.address,
        payload: "",
        remainingGasTo: owner.address,
      })
      .send({
        from: owner.address,
        amount: locklift.utils.toNano(2),
      });
    const { value0: balance } = await tokenRoot.methods.totalSupply({ answerId: 0 }).call();

    expect(Number(balance)).equal(
      INITIAL_SUPPLY + ADDITIONAL_MINT - BURN_AMOUNT,
      "Contract total supply should be the same as initial supply",
    );
  });
  this.afterAll(function () {
    console.log(`  tokenRoot address: ${tokenRoot.address.toString()}`);
    console.log(`  owner address: ${owner.address.toString()}`);
    console.log(`  owner public key: ${ownerKeys.publicKey}`);
    console.log(`  owner private key: ${ownerKeys.secretKey}`);
  });
});

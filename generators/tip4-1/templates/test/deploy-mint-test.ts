import { expect } from 'chai';
import { Account } from 'everscale-standalone-client/nodejs';
import { Address, Contract, WalletTypes } from 'locklift';
import * as nt from 'nekoton-wasm';

import { FactorySource } from '../build/factorySource';

let collection: Contract<FactorySource['Collection']>;
let owner: Account;
let ownerKeys: nt.Ed25519KeyPair;
let nft1Address: Address;
let nft2Address: Address;

describe('Test NFT Collection deployment and NFT minting', async function() {
  before(async () => {
    ownerKeys = nt.ed25519_generateKeyPair();
    locklift.keystore.addKeyPair(ownerKeys);
    const { account } = await locklift.factory.accounts.addNewAccount({
      type: WalletTypes.WalletV3,
      publicKey: ownerKeys.publicKey,
      value: locklift.utils.toNano(4),
    });
    owner = account;
  });
  it('Load Collection contract factory', async function() {
    const contractData = locklift.factory.getContractArtifacts('Collection');
    expect(contractData.code).not.to.equal(
      undefined,
      'Code should be available',
    );
    expect(contractData.abi).not.to.equal(undefined, 'ABI should be available');
    expect(contractData.tvc).not.to.equal(undefined, 'tvc should be available');
  });
  it('Load Nft contract factory', async function() {
    const contractData = locklift.factory.getContractArtifacts('Nft');
    expect(contractData.code).not.to.equal(
      undefined,
      'Code should be available',
    );
    expect(contractData.abi).not.to.equal(undefined, 'ABI should be available');
    expect(contractData.tvc).not.to.equal(undefined, 'tvc should be available');
  });

  it(`Deploy Collection contract`, async function() {
    this.timeout(60000);
    const Nft = locklift.factory.getContractArtifacts('Nft');

    const signer = (await locklift.keystore.getSigner('0'))!;

    const { contract } = await locklift.factory.deployContract({
      contract: 'Collection',
      publicKey: signer.publicKey,
      initParams: {
        _nonce: locklift.utils.getRandomNonce(),
      },
      constructorParams: {
        codeNft: Nft.code,
      },
      value: locklift.utils.toNano(5),
    });
    collection = contract;

    const { count: id } = await collection.methods
      .totalSupply({ answerId: 0 })
      .call();

    expect(id).equal('0', 'Amount of NFT in collection should be 0');
  });

  it(`Mint NFT 1`, async function() {
    this.timeout(60000);
    // call mintNft function
    await collection.methods
      .mintNft({})
      .send({ from: owner.address, amount: locklift.utils.toNano(2) });
    const { count: id } = await collection.methods
      .totalSupply({ answerId: 0 })
      .call();

    const { nft: nftAddress } = await collection.methods
      .nftAddress({ answerId: 0, id: id })
      .call();
    nft1Address = nftAddress;
    expect(id).equal('1', 'NFT id should be 1');
  });

  it(`Mint NFT 2`, async function() {
    this.timeout(60000);
    // call mintNft function
    await collection.methods
      .mintNft({})
      .send({ from: owner.address, amount: locklift.utils.toNano(2) });
    const { count: id } = await collection.methods
      .totalSupply({ answerId: 0 })
      .call();

    const { nft: nftAddress } = await collection.methods
      .nftAddress({ answerId: 0, id: id })
      .call();
    nft2Address = nftAddress;

    expect(id).equal('2', 'NFT id should be 2');
  });

  this.afterAll(function() {
    console.log(`  collection address: ${collection.address.toString()}`);
    console.log(`  NFT1 address: ${nft1Address.toString()}`);
    console.log(`  NFT2 address: ${nft2Address.toString()}`);
    console.log(`  owner address: ${owner.address.toString()}`);
    console.log(`  owner public key: ${ownerKeys.publicKey}`);
    console.log(`  owner private key: ${ownerKeys.secretKey}`);
  });
});

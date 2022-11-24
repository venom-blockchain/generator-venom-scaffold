import { Address, toNano, WalletTypes, zeroAddress } from 'locklift';
import ora from 'ora';
import prompts from 'prompts';

async function main() {
  const spinner = ora();
  const answers = await prompts([
    {
      type: 'text',
      name: 'collectionAddr',
      message: 'Collection address',
      initial: zeroAddress,
    },
  ]);

  if (answers.collectionAddr === zeroAddress) {
    spinner.fail('enter valid collection address');
    return;
  }
  spinner.start(`Mint Nft`);
  try {
    const signer = (await locklift.keystore.getSigner('0'))!;

    // initialize collection contract object by locklift
    const collectionInsance = locklift.factory.getDeployedContract(
      'Collection',
      new Address(answers.collectionAddr),
    );

    // creating new account for Collection calling (or you can get already deployed by locklift.factory.accounts.addExistingAccount)
    const { account: someAccount } =
      await locklift.factory.accounts.addNewAccount({
        type: WalletTypes.WalletV3,
        value: toNano(10),
        publicKey: signer.publicKey,
      });
    // get current nft id (totalSupply) for future NFT address calculating
    const { count: id } = await collectionInsance.methods
      .totalSupply({ answerId: 0 })
      .call();
    spinner.succeed(`id: ${id}`);

    // call mintNft function
    await collectionInsance.methods
      .mintNft({})
      .send({ from: someAccount.address, amount: toNano(1) });

    const { nft: nftAddress } = await collectionInsance.methods
      .nftAddress({ answerId: 0, id: id })
      .call();

    spinner.succeed(`NFT: ${nftAddress.toString()}`);
  } catch (err) {
    spinner.fail(`Failed`);
    console.log(err);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

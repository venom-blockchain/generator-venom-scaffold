import { getRandomNonce, toNano } from "locklift";
import ora from "ora";
import prompts from "prompts";

async function main() {
  const spinner = ora();
  const answers = await prompts([
    {
      type: "text",
      name: "ownerPubkey",
      message: "Owner key",
      initial: "",
    },
  ]);
  spinner.start(`Deploy Collection`);
  try {
    const Nft = await locklift.factory.getContractArtifacts("Nft");
    const Index = await locklift.factory.getContractArtifacts("Index");
    const IndexBasis = await locklift.factory.getContractArtifacts("IndexBasis");

    const signer = (await locklift.keystore.getSigner("0"))!;
    const { contract: collection, tx } = await locklift.factory.deployContract({
      contract: "Collection",
      publicKey: signer.publicKey,
      initParams: {
        _nonce: getRandomNonce(),
      },
      constructorParams: {
        codeNft: Nft.code,
        codeIndex: Index.code,
        json: `{
          "type": "Basic NFT",
          "name": "My first NFT collection",
          "description": "Awesome NFT collection",
          "preview": {
              "source": "https://ipfs.io/ipfs/QmUhkHLKyrpnULfSFnuMGs9qAevsTjqCoNUvDppmSCcLVp?filename=logo.png",
              "mimetype": "image/png"
          },
          "files": [
              {
                  "source": "https://ipfs.io/ipfs/QmUhkHLKyrpnULfSFnuMGs9qAevsTjqCoNUvDppmSCcLVp?filename=logo.png",
                  "mimetype": "image/png"
              }
          ]
      }`,
        codeIndexBasis: IndexBasis.code,
        ownerPubkey: `0x` + answers.ownerPubkey,
      },
      value: toNano(2),
    });
    spinner.succeed(`Deploy Collection`);
    console.log(`Collection deployed at: ${collection.address.toString()}`);
  } catch (err) {
    spinner.fail(`Failed`);
    console.log(err);
  }
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });

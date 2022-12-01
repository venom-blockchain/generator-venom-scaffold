import BigNumber from "bignumber.js";
import { Address, WalletTypes } from "locklift";
import ora from "ora";
import prompts from "prompts";

async function main() {
  const spinner = ora();
  const answers = await prompts([
    {
      type: "text",
      name: "contractAddress",
      message: "Contract address",
    },
    {
      type: "number",
      name: "burnAmount",
      message: "Burn amount",
    },
    {
      type: "text",
      name: "tokensOwnerAddress",
      message: "Tokens owner address",
    },
    {
      type: "text",
      name: "tokensOwnerPublicKey",
      message: "Tokens owner public key",
    },
  ]);
  spinner.start(`Burn tokens...`);
  try {
    const tokenRoot = locklift.factory.getDeployedContract("TokenRoot", new Address(answers.contractAddress));

    const { value0: decimals } = await tokenRoot.methods.decimals({ answerId: 0 }).call();

    const sender = await locklift.factory.accounts.addExistingAccount({
      publicKey: answers.tokensOwnerPublicKey,
      type: WalletTypes.WalletV3,
    });
    const tx = await tokenRoot.methods
      .burnTokens({
        amount: new BigNumber(answers.burnAmount).shiftedBy(Number(decimals)).toFixed(),
        walletOwner: new Address(answers.tokensOwnerAddress),
        callbackTo: new Address(answers.tokensOwnerAddress),
        payload: "",
        remainingGasTo: sender.address,
      })
      .send({
        from: sender.address,
        amount: locklift.utils.toNano(2),
      });
    spinner.info(`tx hash: ${tx.id.hash}`);
    spinner.succeed(`tokens burned`);
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

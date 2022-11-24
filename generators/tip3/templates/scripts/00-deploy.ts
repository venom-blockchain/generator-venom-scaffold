import { zeroAddress } from "locklift";
import BigNumber from "bignumber.js"


const ROOT_OWNER_ADDRESS = "<%= props.rootOwnerAddress %>";
const REMAINING_GAS_TO = "<%= props.remainingGasTo %>";
const NAME = "<%= props.tokenName %>";
const SYMBOL = "<%= props.tokenSymbol %>";
const INITIAL_SUPPLY_TO = "<%= props.initialSupplyTo %>";
const INITIAL_SUPPLY = "<%= props.initialSupply %>";
const DECIMALS = <%= props.decimals %>;
const DISABLE_MINT = <%= props.disableMint %>;
const DISABLE_BURN_BY_ROOT = <%= props.disableBurn %>;
const PAUSE_BURN = <%= props.pauseBurn %>;

async function main() {
  console.log("Starting TIP3 contract deployment...");

  const signer = (await locklift.keystore.getSigner("0"))!;
  const tokenWalletContract = locklift.factory.getContractArtifacts("TokenWallet");

  const initParams = {
    name_: NAME,
    symbol_: SYMBOL,
    decimals_: DECIMALS,
    rootOwner_: ROOT_OWNER_ADDRESS,
    walletCode_: tokenWalletContract.code,
    randomNonce_: locklift.utils.getRandomNonce(),
    deployer_: zeroAddress.toString(),
  };
  const constructorParams = {
    initialSupplyTo: INITIAL_SUPPLY_TO,
    initialSupply: new BigNumber(INITIAL_SUPPLY).shiftedBy(DECIMALS).toFixed(),
    deployWalletValue: locklift.utils.toNano(2),
    mintDisabled: DISABLE_MINT,
    burnByRootDisabled: DISABLE_BURN_BY_ROOT,
    burnPaused: PAUSE_BURN,
    remainingGasTo: REMAINING_GAS_TO,
  };

  const { contract: tokenRoot, tx } = await locklift.factory.deployContract({
    contract: "TokenRoot",
    publicKey: signer.publicKey,
    initParams,
    constructorParams,
    value: locklift.utils.toNano(4),
  });

  console.log(`TIP3 contract deployed at: ${tokenRoot.address.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });

pragma ever-solidity >= 0.61.2;

pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import '@itgold/everscale-tip/contracts/TIP4_1/TIP4_1Nft.sol';

contract Nft is TIP4_1Nft {

    constructor(
        address owner,
        address sendGasTo,
        uint128 remainOnNft
    ) TIP4_1Nft(
        owner,
        sendGasTo,
        remainOnNft
    ) public {}

}
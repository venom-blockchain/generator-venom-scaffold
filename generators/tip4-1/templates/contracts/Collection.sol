pragma ever-solidity >= 0.61.2;

pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import '@itgold/everscale-tip/contracts/TIP4_1/TIP4_1Collection.sol';
import './Nft.sol';

contract Collection is TIP4_1Collection {
    uint16 static _nonce;
    constructor(
        TvmCell codeNft
    ) TIP4_1Collection (
        codeNft
    ) public {
        tvm.accept();
    }

    function mintNft() external virtual {
        require(msg.value > 0.4 ever, 101);
        tvm.rawReserve(0, 4);

        uint256 id = uint256(_totalSupply);
        _totalSupply++;

        TvmCell codeNft = _buildNftCode(address(this));
        TvmCell stateNft = tvm.buildStateInit({
            contr: Nft,
            varInit: {_id: id},
            code: codeNft
        });
        new Nft{
            stateInit: stateNft,
            value: 0,
            flag: 128
        }(
            msg.sender,
            msg.sender,
            0.3 ever
        );     
    }
}
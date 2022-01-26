pragma solidity ^0.7.3;
/**
* Attack contract boilerplate template. 
* Useful to create an attack contract for a new challenge without accidentally
* peaking at the solution.
*/

interface ICoinFlipChallenge {
    function flip(bool _guess) external returns (bool);
}

contract TODOAttacker {
    ICoinFlipChallenge public challenge;

    constructor(address challengeAddress) {
        challenge = ICoinFlipChallenge(challengeAddress);
    }

    function attack() external payable {

    }
}

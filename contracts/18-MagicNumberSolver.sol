pragma solidity ^0.7.3;
/////
 // Attack contract boilerplate template. 
 // Useful to create an attack contract for a new challenge without accidentally
 // peaking at the solution.
 ///
interface IMagicNumChallenge {
    function setSolver(address _solver) external;
}
contract MagicNumSolver {

    IMagicNumChallenge public challenge;

    constructor(address challengeAddress) {
        challenge = IMagicNumChallenge(challengeAddress);
    }

    function attack() external {
        /////
         // 60 0a    PUSH1 0xa   // Push '10'. This is the number of bytes of the solver contract
         // 60 0c    PUSH1 0xc   // Push '12' This is the number of bytes of this deployment portion of the contract
         // 60 00    PUSH1 0x0   // Push '0'
         // 39       CODECOPY    // Copy 10 bytes from offset 12 to destination offset 0.
         // 60 0a    PUSH1 0xa   // Push '12'
         // 60 00    PUSH1 0x0   // Push '0'
         // f3       RETURN      // Return. END CONTRACT DEPLOYMENT CODE.
         // 60 2a    PUSH1 0x2a  // Push '42' to the stack
         // 60 00    PUSH1 0x00  // Use 0 as our storage location; arbitrary
         // 52       MSTORE      // Store the value in memory
         // 60 20    PUSH1 0x20  // Push '32'. This is the amount of memory we will return
         // 60 00    PUSH1 0x00  // Push '0'. Returning from our storage location from above
         // F3       RETURN      // Return the value (32 bytes from address 0). END CONTRACT CODE


        // Use create2 to make a new contract at the address
        // All the bytecode from above
        bytes memory bytecode = hex"600a600c600039600a6000f3602a60005260206000f3";
        bytes32 salt = 0; // not important for our purposes but required by CREATE2
        address solver;   // destination contract address

        assembly {
            // add creates a 32 byte offset (0x20) from the bytecode memory
            // mload here returns the size of the bytecode.
            solver := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }

        challenge.setSolver(solver);
    }
}

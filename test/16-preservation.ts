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
  const challengeFactory = await ethers.getContractFactory(`Preservation`);
  // The below address comes from Ethernaut deployed on Rinkeby
  // Go to https://ethernaut.openzeppelin.com/, select a Level, grab address
  // from the URL
  const challengeAddress = await createChallenge(
    `0x97E982a15FbB1C28F6B8ee971BEc15C78b3d263F`
  );
  challenge = await challengeFactory.attach(challengeAddress);

  // Update this to match your attack contract
  const attackerFactory = await ethers.getContractFactory(`PreservationAttacker`);
  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
    // Write solution code here
    tx = await attacker.attack();
    await tx.wait();
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});

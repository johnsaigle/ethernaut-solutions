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
  const challengeFactory = await ethers.getContractFactory(`Reentrance`);
  // No idea where this address comes from... stolen from MrToph again
  // Does not match the ethernaut website
  const challengeAddress = await createChallenge(
      `0x848fb2124071146990c7abE8511f851C7f527aF4`,
      ethers.utils.parseUnits(`1`, `ether`)
  );
  challenge = await challengeFactory.attach(challengeAddress);

  // Update this to match your attack contract
  const attackerFactory = await ethers.getContractFactory(`ReentranceAttacker`);
  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
    tx = await attacker.attack({
        value: ethers.utils.parseUnits(`1`, `ether`),
    });
    await tx.wait();
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
